// All membership date logic lives here so the rules stay consistent
// everywhere they're used (list views, alerts, chart).

export function computeEndDate(startDateStr, durationMonths) {
  const start = new Date(startDateStr)
  const end = new Date(start)
  end.setMonth(end.getMonth() + Number(durationMonths))
  return end.toISOString().slice(0, 10) // YYYY-MM-DD
}

export function daysUntil(dateStr) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  return Math.round((target - today) / (1000 * 60 * 60 * 24))
}

// 'active'    -> more than 3 days left
// 'expiring'  -> ends within the next 3 days (still active today)
// 'expired'   -> end date has passed
export function membershipStatus(endDateStr) {
  const diff = daysUntil(endDateStr)
  if (diff < 0) return 'expired'
  if (diff <= 3) return 'expiring'
  return 'active'
}

// Change the currency here in one place if the gym ever needs a
// different one — everywhere else calls this function instead of
// hardcoding a symbol.
export function formatCurrency(amount) {
  return `${Number(amount).toFixed(2)} TND`
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

export function monthLabel(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    year: '2-digit'
  })
}

// Groups PAYMENT records (not members) by the month they were paid for
// and sums the amount. Payments are a permanent ledger — a row is written
// once when a member joins or renews, and is never touched again — so
// deleting or renewing a member later can't change historical earnings.
export function buildEarningsSeries(payments) {
  const buckets = {}

  payments.forEach((p) => {
    if (!p.paid_at) return
    const d = new Date(p.paid_at)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!buckets[key]) {
      buckets[key] = {
        key,
        label: monthLabel(p.paid_at),
        total: 0,
        count: 0,
        sortDate: new Date(d.getFullYear(), d.getMonth(), 1)
      }
    }
    buckets[key].total += Number(p.amount || 0)
    buckets[key].count += 1
  })

  return Object.values(buckets).sort((a, b) => a.sortDate - b.sortDate)
}

// Buckets active members into age ranges for the age-breakdown chart.
// Members with no age recorded are simply skipped rather than counted
// as "unknown", since that's rarely useful on a small roster.
export function buildAgeBreakdown(members) {
  const buckets = [
    { key: 'bu20', min: 0, max: 19, count: 0 },
    { key: 'b20s', min: 20, max: 29, count: 0 },
    { key: 'b30s', min: 30, max: 39, count: 0 },
    { key: 'b40s', min: 40, max: 49, count: 0 },
    { key: 'b50p', min: 50, max: 999, count: 0 }
  ]

  members.forEach((m) => {
    if (m.age == null) return
    const bucket = buckets.find((b) => m.age >= b.min && m.age <= b.max)
    if (bucket) bucket.count += 1
  })

  return buckets.filter((b) => b.count > 0)
}

// Looks at every completed membership period (from the payments ledger)
// and checks whether the member came back within 14 days of it ending.
// A period only counts once we actually know the outcome: either a later
// payment exists for that member, or the period has already expired with
// no follow-up payment (a lapsed member). A period that hasn't ended yet
// and has no later payment is still "pending" and is left out entirely.
export function buildRenewalRate(payments) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const groups = {}
  payments.forEach((p) => {
    const key = p.member_name || 'Unknown'
    if (!groups[key]) groups[key] = []
    groups[key].push(p)
  })

  let eligible = 0
  let renewed = 0

  Object.values(groups).forEach((list) => {
    const sorted = [...list].sort((a, b) => new Date(a.paid_at) - new Date(b.paid_at))

    sorted.forEach((cur, i) => {
      const end = new Date(computeEndDate(cur.paid_at, cur.duration_months || 1))
      const next = sorted[i + 1]

      if (next) {
        eligible += 1
        const gapDays = Math.round((new Date(next.paid_at) - end) / (1000 * 60 * 60 * 24))
        if (gapDays <= 14) renewed += 1
      } else if (end < today) {
        eligible += 1
        // no follow-up payment and the period is over -> lapsed, doesn't add to `renewed`
      }
      // else: this is the member's current, still-active period -> not judged yet
    })
  })

  return {
    pct: eligible > 0 ? (renewed / eligible) * 100 : null,
    eligible,
    renewed
  }
}
// renewal), using the same permanent ledger. Grouped by the name snapshot
// stored on each payment row, so a member who was later deleted still
// shows up correctly in their historical count.
export function buildLoyaltySeries(payments, limit = 10) {
  const counts = {}

  payments.forEach((p) => {
    const name = p.member_name || 'Unknown'
    if (!counts[name]) counts[name] = { name, count: 0, total: 0 }
    counts[name].count += 1
    counts[name].total += Number(p.amount || 0)
  })

  return Object.values(counts)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}