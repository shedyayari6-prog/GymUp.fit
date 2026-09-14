import { useLanguage } from '../context/LanguageContext'

export default function ExpiryAlertBanner({ expiringSoon, justExpired, onViewExpired }) {
  const { t } = useLanguage()
  if (expiringSoon.length === 0 && justExpired.length === 0) return null

  return (
    <div className="mb-6 rounded-md border border-rust/50 bg-rust/10 px-5 py-4 flex items-start justify-between gap-4">
      <div>
        <p className="text-chalk font-semibold mb-1">{t('alert.title')}</p>
        <p className="text-chalkdim text-sm">
          {justExpired.length > 0 && <>{t('alert.expired', justExpired.length)} </>}
          {expiringSoon.length > 0 && <>{t('alert.expiring', expiringSoon.length)}</>}
        </p>
      </div>
      {justExpired.length > 0 && (
        <button
          onClick={onViewExpired}
          className="shrink-0 text-sm font-medium bg-rust text-chalk px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
        >
          {t('alert.viewExpired')}
        </button>
      )}
    </div>
  )
}
