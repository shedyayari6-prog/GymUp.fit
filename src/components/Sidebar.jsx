import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'

export default function Sidebar({ current, onChange, gymName, ownerId, expiredCount, expiringCount }) {
  const { signOut } = useAuth()
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)

  const TABS = [
    { id: 'active', label: t('sidebar.tabActive') },
    { id: 'expired', label: t('sidebar.tabExpired') },
    { id: 'staff', label: t('sidebar.tabStaff') },
    { id: 'earnings', label: t('sidebar.tabEarnings') }
  ]

  function copyId() {
    navigator.clipboard.writeText(ownerId)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <aside className="w-64 shrink-0 bg-graphite border-e border-steel flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-steel">
        <div className="font-display text-2xl font-bold tracking-wide bg-gradient-to-r from-brasslight via-brass to-brasslight bg-clip-text text-transparent">
          {t('brand')}
        </div>
        <div className="text-chalkdim text-sm mt-1 truncate">{gymName || t('sidebar.yourGym')}</div>
        {ownerId && (
          <button
            onClick={copyId}
            title="Click to copy your account ID"
            className="mt-2 w-full text-start text-xs text-chalkdim/70 hover:text-brasslight transition-colors font-mono truncate"
          >
            {copied ? t('sidebar.copied') : t('sidebar.idPrefix')(ownerId)}
          </button>
        )}
        <LanguageSwitcher />
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`w-full text-start px-4 py-2.5 rounded-md flex items-center justify-between transition-colors ${
              current === tab.id
                ? 'bg-brass text-ink font-semibold'
                : 'text-chalkdim hover:bg-steel hover:text-chalk'
            }`}
          >
            <span>{tab.label}</span>
            {tab.id === 'expired' && expiredCount > 0 && (
              <span className="text-xs bg-rust text-chalk rounded-full px-2 py-0.5">
                {expiredCount}
              </span>
            )}
            {tab.id === 'active' && expiringCount > 0 && (
              <span className="text-xs bg-brasslight text-ink rounded-full px-2 py-0.5">
                {expiringCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-steel">
        <button
          onClick={signOut}
          className="w-full text-start px-4 py-2.5 rounded-md text-chalkdim hover:bg-steel hover:text-chalk transition-colors"
        >
          {t('sidebar.signOut')}
        </button>
      </div>
    </aside>
  )
}