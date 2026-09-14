import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { buildAgeBreakdown } from '../lib/memberUtils'
import { useLanguage } from '../context/LanguageContext'

const COLORS = ['#D4AF60', '#B08D3E', '#9A3324', '#3F7D5C', '#B9BBC3']

function SliceTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { label, count } = payload[0].payload
  return (
    <div className="bg-graphite border border-steel rounded-md px-3 py-2 text-sm">
      <span className="text-chalk">{label}</span>
      <span className="text-chalkdim">: {count}</span>
    </div>
  )
}

export default function AgeBreakdownChart({ members }) {
  const { t } = useLanguage()
  const data = buildAgeBreakdown(members).map((b) => ({ ...b, label: t(`ageChart.${b.key}`) }))

  return (
    <div className="bg-graphite border border-steel rounded-md p-5">
      <h3 className="font-display text-lg text-chalk mb-1">{t('ageChart.title')}</h3>

      {data.length === 0 ? (
        <p className="text-chalkdim text-sm mt-2">{t('ageChart.empty')}</p>
      ) : (
        <>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="label"
                  innerRadius={42}
                  outerRadius={72}
                  paddingAngle={2}
                  stroke="none"
                >
                  {data.map((entry, i) => (
                    <Cell key={entry.key} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<SliceTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 space-y-1.5">
            {data.map((d, i) => (
              <li key={d.key} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-chalkdim">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: COLORS[i % COLORS.length] }}
                  />
                  {d.label}
                </span>
                <span className="text-chalk font-medium">{d.count}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
