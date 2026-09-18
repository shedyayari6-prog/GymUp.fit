import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useLanguage } from '../context/LanguageContext'

export default function EmployeeModal({ existing, ownerId, onClose, onSaved }) {
  const { t } = useLanguage()
  const [name, setName] = useState(existing?.name ?? '')
  const [hourlyRate, setHourlyRate] = useState(existing?.hourly_rate ?? '')
  const [pin, setPin] = useState(existing?.pin ?? '')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)

    const payload = {
      owner_id: ownerId,
      name,
      hourly_rate: hourlyRate === '' ? 0 : Number(hourlyRate),
      pin: pin === '' ? null : pin
    }

    let saveError
    if (existing) {
      ;({ error: saveError } = await supabase.from('employees').update(payload).eq('id', existing.id))
    } else {
      ;({ error: saveError } = await supabase.from('employees').insert(payload))
    }

    setBusy(false)
    if (saveError) {
      setError(saveError.message)
      return
    }
    onSaved()
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-graphite border border-steel rounded-md w-full max-w-md p-6">
        <h2 className="font-display text-2xl text-chalk mb-5">
          {existing ? t('staff.editEmployee') : t('staff.addEmployee')}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-chalkdim text-sm mb-1">{t('staff.employeeName')}</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md bg-ink border border-steel px-3 py-2 text-chalk focus:border-brass outline-none"
            />
          </div>

          <div>
            <label className="block text-chalkdim text-sm mb-1">{t('staff.hourlyRate')}</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              className="w-full rounded-md bg-ink border border-steel px-3 py-2 text-chalk focus:border-brass outline-none"
            />
          </div>

          <div>
            <label className="block text-chalkdim text-sm mb-1">{t('staff.pin')}</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="1234"
              className="w-full rounded-md bg-ink border border-steel px-3 py-2 text-chalk focus:border-brass outline-none"
            />
            <p className="text-chalkdim/60 text-xs mt-1">{t('staff.pinHint')}</p>
          </div>

          {error && <p className="text-rust text-sm">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-chalkdim hover:text-chalk transition-colors"
            >
              {t('memberModal.cancel')}
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-5 py-2 rounded-md bg-brass hover:bg-brasslight text-ink font-semibold transition-colors disabled:opacity-60"
            >
              {busy ? t('memberModal.saving') : t('staff.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
