import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useLanguage } from '../context/LanguageContext'

// Reuses the SAME code set up on the Earnings tab (profiles.earnings_password)
// as a gate in front of adding/editing/deleting staff -- so only whoever
// knows that code can change the staff roster, while clocking in/out stays
// open for any employee to use freely.
export default function StaffCodeGate({ ownerId, onConfirm, onCancel }) {
  const { t } = useLanguage()
  const [storedPassword, setStoredPassword] = useState(null)
  const [loading, setLoading] = useState(true)
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('earnings_password')
        .eq('id', ownerId)
        .maybeSingle()
      if (cancelled) return
      if (error) console.error('Failed to load earnings password:', error.message)
      setStoredPassword(data?.earnings_password ?? null)
      setLoading(false)
    }
    if (ownerId) load()
    return () => {
      cancelled = true
    }
  }, [ownerId])

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!storedPassword) {
      setError(t('staff.noCodeSet'))
      return
    }
    if (input === storedPassword) {
      onConfirm()
    } else {
      setError(t('earnings.wrongPassword'))
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-graphite border border-steel rounded-md w-full max-w-sm p-6">
        <h2 className="font-display text-xl text-chalk mb-2">{t('staff.enterCodeTitle')}</h2>
        <p className="text-chalkdim text-sm mb-5">{t('staff.enterCodeHint')}</p>

        {loading ? (
          <p className="text-chalkdim text-sm">{t('dashboard.loading')}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('earnings.enterPassword')}
              className="w-full bg-ink border border-steel rounded-md px-3 py-2 text-chalk focus:outline-none focus:border-brass"
              autoFocus
            />
            {error && <p className="text-rust text-sm">{error}</p>}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2 rounded-md text-chalkdim hover:text-chalk border border-steel transition-colors"
              >
                {t('memberModal.cancel')}
              </button>
              <button
                type="submit"
                className="flex-1 bg-brass hover:bg-brasslight transition-colors text-ink font-semibold px-4 py-2 rounded-md"
              >
                {t('earnings.unlock')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
