import { useState, useMemo } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts'
import { buildEarningsSeries } from '../lib/memberUtils'
import { buildLaborCost } from '../lib/staffUtils'
import { useLanguage } from '../context/LanguageContext'

function CustomTooltip({ active, payload, label }) {
  const { t } = useLanguage()
  if (!active || !payload?.length) return null
  const { total, count } = payload[0].payload
  return (
    <div className="bg-graphite border border-steel rounded-md px-4 py-3 text-sm">
      <div className="text-chalk font-medium mb-1">{label}</div>
      <div className="text-brasslight">{t('earnings.tooltipEarned', total)}</div>
      <div className="text-chalkdim">{t('earnings.tooltipBilled', count)}</div>
    </div>
  )
}

export default function EarningsChart({ payments, employees = [], timeEntries = [] }) {
  const { t } = useLanguage()
  const [chartType, setChartType] = useState('area')

  // Every year that actually has a payment in it, newest first, plus an
  // "All time" option. Defaults to the most recent year with data so the
  // chart opens on something useful instead of an empty "All time" view.
  const availableYears = useMemo(() => {
    const years = new Set(payments.map((p) => new Date(p.paid_at).getFullYear()))
    return Array.from(years).sort((a, b) => b - a)
  }, [payments])

  const [selectedYear, setSelectedYear] = useState(() =>
    availableYears.length > 0 ? String(availableYears[0]) : 'all'
  )

  const filteredPayments = useMemo(() => {
    if (selectedYear === 'all') return payments
    return payments.filter((p) => new Date(p.paid_at).getFullYear() === Number(selectedYear))
  }, [payments, selectedYear])

  const data = buildEarningsSeries(filteredPayments)

  const stats = useMemo(() => {
    if (data.length === 0) return null

    const totalAllTime = data.reduce((sum, d) => sum + d.total, 0)
    const bestMonth = data.reduce((a, b) => (b.total > a.total ? b : a), data[0])
    const avgPerMonth = totalAllTime / data.length

    const totalMembersBilled = data.reduce((sum, d) => sum + d.count, 0)
    const avgPerMember = totalMembersBilled > 0 ? totalAllTime / totalMembersBilled : 0

    let growthPct = null
    if (data.length >= 2) {
      const prev = data[data.length - 2].total
      const curr = data[data.length - 1].total
      if (prev > 0) growthPct = ((curr - prev) / prev) * 100
    }

    const recent = data.slice(-3)
    const projectedNext = recent.reduce((sum, d) => sum + d.total, 0) / recent.length

    return { totalAllTime, bestMonth, avgPerMonth, avgPerMember, growthPct, projectedNext }
  }, [data])

  // Labor cost for this same selected year, so revenue and staff cost are
  // always looking at the same time window.
  const labor = useMemo(
    () => buildLaborCost(timeEntries, employees, selectedYear),
    [timeEntries, employees, selectedYear]
  )

  const yearSelector = (
    <select
      value={selectedYear}
      onChange={(e) => setSelectedYear(e.target.value)}
      className="rounded-md bg-ink border border-steel px-3 py-1.5 text-sm text-chalk focus:border-brass outline-none"
    >
      <option value="all">{t('earnings.allYears')}</option>
      {availableYears.map((y) => (
        <option key={y} value={y}>
          {y}
        </option>
      ))}
    </select>
  )

  if (data.length === 0) {
    return (
      <div>
        {payments.length > 0 && (
          <div className="flex justify-end mb-4">{yearSelector}</div>
        )}
        <div className="border border-dashed border-steel rounded-md py-16 text-center text-chalkdim">
          {t('earnings.empty')}
        </div>
      </div>
    )
  }

  const ChartTag = chartType === 'bar' ? BarChart : AreaChart

  return (
    <div>
      <div className="flex justify-end mb-4">{yearSelector}</div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-graphite border border-steel rounded-md px-5 py-4">
          <div className="text-chalkdim text-sm mb-1">{t('earnings.totalEarned')}</div>
          <div className="font-display text-3xl text-chalk"> {stats.totalAllTime.toFixed(2)} TND</div>
        </div>
        <div className="bg-graphite border border-steel rounded-md px-5 py-4">
          <div className="text-chalkdim text-sm mb-1">{t('earnings.bestMonth')}</div>
          <div className="font-display text-3xl text-brasslight">{stats.bestMonth.label}</div>
        </div>
        <div className="bg-graphite border border-steel rounded-md px-5 py-4 col-span-2 md:col-span-1">
          <div className="text-chalkdim text-sm mb-1">{t('earnings.monthsTracked')}</div>
          <div className="font-display text-3xl text-chalk">{data.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-graphite border border-steel rounded-md px-5 py-4">
          <div className="text-chalkdim text-sm mb-1">{t('earnings.avgPerMonth')}</div>
          <div className="font-display text-2xl text-chalk"> {stats.avgPerMonth.toFixed(2)} TND</div>
        </div>
        <div className="bg-graphite border border-steel rounded-md px-5 py-4">
          <div className="text-chalkdim text-sm mb-1">{t('earnings.avgPerMember')}</div>
          <div className="font-display text-2xl text-chalk"> {stats.avgPerMember.toFixed(2)} TND</div>
        </div>
        <div className="bg-graphite border border-steel rounded-md px-5 py-4">
          <div className="text-chalkdim text-sm mb-1">{t('earnings.growth')}</div>
          {stats.growthPct === null ? (
            <div className="font-display text-2xl text-chalkdim">—</div>
          ) : (
            <div
              className={`font-display text-2xl ${
                stats.growthPct >= 0 ? 'text-good' : 'text-rust'
              }`}
            >
              {stats.growthPct >= 0 ? '+' : ''}
              {stats.growthPct.toFixed(1)}%
            </div>
          )}
        </div>
      </div>

      {(employees.length > 0 || timeEntries.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-graphite border border-steel rounded-md px-5 py-4">
            <div className="text-chalkdim text-sm mb-1">{t('earnings.laborCost')}</div>
            <div className="font-display text-2xl text-rust">{labor.totalCost.toFixed(2)} TND</div>
            <div className="text-chalkdim/70 text-xs mt-1">{t('earnings.laborHours', labor.totalHours.toFixed(1))}</div>
          </div>
          <div className="bg-graphite border border-steel rounded-md px-5 py-4">
            <div className="text-chalkdim text-sm mb-1">{t('earnings.netEarnings')}</div>
            <div
              className={`font-display text-2xl ${
                stats.totalAllTime - labor.totalCost >= 0 ? 'text-good' : 'text-rust'
              }`}
            >
              {(stats.totalAllTime - labor.totalCost).toFixed(2)} TND
            </div>
          </div>
        </div>
      )}

      <div className="bg-graphite border border-steel rounded-md px-5 py-4 mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="text-chalkdim text-sm mb-1">{t('earnings.projectedNext')}</div>
          <div className="font-display text-2xl text-brasslight">{stats.projectedNext.toFixed(2)} TND </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setChartType('area')}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${
              chartType === 'area'
                ? 'bg-brass border-brass text-ink'
                : 'bg-ink border-steel text-chalkdim hover:border-brass hover:text-chalk'
            }`}
          >
            {t('earnings.viewArea')}
          </button>
          <button
            type="button"
            onClick={() => setChartType('bar')}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${
              chartType === 'bar'
                ? 'bg-brass border-brass text-ink'
                : 'bg-ink border-steel text-chalkdim hover:border-brass hover:text-chalk'
            }`}
          >
            {t('earnings.viewBar')}
          </button>
        </div>
      </div>

      <div className="bg-graphite border border-steel rounded-md p-5 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ChartTag data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="earningsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4AF60" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#D4AF60" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#3A3B42" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" stroke="#B9BBC3" tickLine={false} axisLine={{ stroke: '#3A3B42' }} />
            <YAxis stroke="#B9BBC3" tickLine={false} axisLine={{ stroke: '#3A3B42' }} width={50} />
            <Tooltip content={<CustomTooltip />} />
            {chartType === 'bar' ? (
              <Bar dataKey="total" fill="#D4AF60" radius={[4, 4, 0, 0]} />
            ) : (
              <Area
                type="monotone"
                dataKey="total"
                stroke="#D4AF60"
                strokeWidth={2}
                fill="url(#earningsFill)"
              />
            )}
          </ChartTag>
        </ResponsiveContainer>
      </div>
    </div>
  )
}