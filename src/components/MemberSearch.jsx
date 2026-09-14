import { useMemo, useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { membershipStatus } from '../lib/memberUtils'

function ResultStatusDot({ endDate }) {
  const status = membershipStatus(endDate)
  const color =
    status === 'expired' ? 'bg-rust' : status === 'expiring' ? 'bg-brasslight' : 'bg-good'
  return <span className={`w-2 h-2 rounded-full shrink-0 ${color}`} />
}

export default function MemberSearch({ members, onSelect }) {
  const { t } = useLanguage()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return members.filter((m) => m.name?.toLowerCase().includes(q)).slice(0, 8)
  }, [query, members])

  function handleSelect(member) {
    onSelect(member)
    setQuery('')
    setOpen(false)
  }

  return (
    <div className="relative w-full max-w-sm" ref={containerRef}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        placeholder={t('search.placeholder')}
        className="w-full rounded-md bg-graphite border border-steel px-3 py-2 text-chalk placeholder:text-chalkdim/60 focus:border-brass outline-none"
      />

      {open && query.trim() !== '' && (
        <div className="absolute z-40 mt-1 w-full bg-graphite border border-steel rounded-md shadow-lg overflow-hidden">
          {results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-chalkdim">{t('search.noResults')}</div>
          ) : (
            results.map((m) => (
              <button
                key={m.id}
                onMouseDown={() => handleSelect(m)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-start hover:bg-steel transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-steel overflow-hidden shrink-0">
                  {m.photo_url && (
                    <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <span className="text-chalk text-sm flex-1 truncate">{m.name}</span>
                <ResultStatusDot endDate={m.end_date} />
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
