import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

export default function QuickNotes({ ownerId }) {
  const { t } = useLanguage()
  const storageKey = `gymup_notes_${ownerId}`
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(true)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (!ownerId) return
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored != null) setNotes(stored)
    } catch {
      // localStorage can be unavailable (private browsing, etc.) -- fail quietly
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerId])

  function handleChange(e) {
    const value = e.target.value
    setNotes(value)
    setSaved(false)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, value)
      } catch {
        // ignore -- nothing useful to do if storage is blocked
      }
      setSaved(true)
    }, 500)
  }

  return (
    <div className="bg-graphite border border-steel rounded-md p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display text-lg text-chalk">{t('notes.title')}</h3>
        <span className="text-xs text-chalkdim">{saved ? t('notes.saved') : t('notes.saving')}</span>
      </div>
      <textarea
        value={notes}
        onChange={handleChange}
        placeholder={t('notes.placeholder')}
        rows={8}
        className="w-full rounded-md bg-ink border border-steel px-3 py-2 text-chalk text-sm focus:border-brass outline-none resize-none"
      />
      <p className="text-chalkdim/60 text-xs mt-2">{t('notes.localOnly')}</p>
    </div>
  )
}