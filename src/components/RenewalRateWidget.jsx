import { buildRenewalRate } from '../lib/memberUtils'
import { useLanguage } from '../context/LanguageContext'

export default function RenewalRateWidget({ payments }) {
  const { t } = useLanguage()
  const { pct, eligible, renewed } = buildRenewalRate(payments)

  return (
    <div className="bg-graphite border border-steel rounded-md p-5">
      <h3 className="font-display text-lg text-chalk mb-1">{t('renewalRate.title')}</h3>
      <p className="text-chalkdim text-sm mb-4">{t('renewalRate.subtitle')}</p>

      {pct === null ? (
        <p className="text-chalkdim text-sm">{t('renewalRate.empty')}</p>
      ) : (
        <>
          <div
            className={`font-display text-4xl mb-1 ${
              pct >= 70 ? 'text-good' : pct >= 40 ? 'text-brasslight' : 'text-rust'
            }`}
          >
            {pct.toFixed(0)}%
          </div>
          <p className="text-chalkdim text-sm">{t('renewalRate.detail', renewed, eligible)}</p>
        </>
      )}
    </div>
  )
}
