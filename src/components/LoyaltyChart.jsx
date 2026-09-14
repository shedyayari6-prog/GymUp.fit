import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts'
import { buildLoyaltySeries } from '../lib/memberUtils'
import { useLanguage } from '../context/LanguageContext'

function LoyaltyTooltip({ active, payload }) {
  const { t } = useLanguage()
  if (!active || !payload?.length) return null
  const { name, count } = payload[0].payload
  return (
    <div className="bg-graphite border border-steel rounded-md px-4 py-3 text-sm">
      <div className="text-chalk font-medium mb-1">{name}</div>
      <div className="text-brasslight">{t('loyalty.tooltipCount', count)}</div>
      {count > 1 && <div className="text-chalkdim">{t('loyalty.tooltipRenewals', count - 1)}</div>}
    </div>
  )
}

export default function LoyaltyChart({ payments }) {
  const { t } = useLanguage()
  const data = buildLoyaltySeries(payments)

  if (data.length === 0) {
    return (
      <div>
        <h2 className="font-display text-xl text-chalk mb-1">{t('loyalty.title')}</h2>
        <p className="text-chalkdim text-sm mb-4">{t('loyalty.subtitle')}</p>
        <div className="border border-dashed border-steel rounded-md py-16 text-center text-chalkdim">
          {t('loyalty.empty')}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="font-display text-xl text-chalk mb-1">{t('loyalty.title')}</h2>
      <p className="text-chalkdim text-sm mb-4">{t('loyalty.subtitle')}</p>
      <div
        className="bg-graphite border border-steel rounded-md p-5"
        style={{ height: Math.max(220, data.length * 44) }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 24, left: 10, bottom: 0 }}>
            <CartesianGrid stroke="#3A3B42" strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              allowDecimals={false}
              stroke="#B9BBC3"
              tickLine={false}
              axisLine={{ stroke: '#3A3B42' }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              stroke="#B9BBC3"
              tickLine={false}
              axisLine={{ stroke: '#3A3B42' }}
            />
            <Tooltip content={<LoyaltyTooltip />} cursor={{ fill: '#3A3B42', opacity: 0.3 }} />
            <Bar dataKey="count" fill="#D4AF60" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
