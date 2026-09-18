// All the math for clock in/out shifts and labor cost lives here, kept
// separate from memberUtils.js since it's a different domain entirely.

export function computeHours(clockIn, clockOut) {
  if (!clockIn || !clockOut) return 0
  const ms = new Date(clockOut) - new Date(clockIn)
  return Math.max(0, ms / (1000 * 60 * 60))
}

export function formatHours(hours) {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  if (h === 0 && m === 0) return '0h'
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function startOfWeek(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay() // 0 = Sunday
  const diff = (day + 6) % 7 // days since Monday
  d.setDate(d.getDate() - diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export function startOfMonth(date = new Date()) {
  const d = new Date(date)
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d
}

// Total hours a given employee has worked since a cutoff date, counting
// only shifts that have actually been clocked out (an open shift doesn't
// count toward totals until it ends).
export function hoursWorkedSince(entries, employeeId, sinceDate) {
  return entries
    .filter((e) => e.employee_id === employeeId && e.clock_out && new Date(e.clock_in) >= sinceDate)
    .reduce((sum, e) => sum + computeHours(e.clock_in, e.clock_out), 0)
}

// Total hours worked and total cost (using each employee's CURRENT
// hourly rate) across all closed shifts within a given year, or 'all'
// for everything. This is what feeds the Earnings tab's labor cost figure.
export function buildLaborCost(entries, employees, year) {
  const rateById = {}
  employees.forEach((e) => {
    rateById[e.id] = Number(e.hourly_rate || 0)
  })

  let totalHours = 0
  let totalCost = 0

  entries.forEach((e) => {
    if (!e.clock_out) return
    if (year !== 'all' && new Date(e.clock_in).getFullYear() !== Number(year)) return
    const hours = computeHours(e.clock_in, e.clock_out)
    totalHours += hours
    totalCost += hours * (rateById[e.employee_id] || 0)
  })

  return { totalHours, totalCost }
}
