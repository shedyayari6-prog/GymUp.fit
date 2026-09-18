import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { formatDate } from '../lib/memberUtils'
import { computeHours, formatHours, hoursWorkedSince, startOfMonth, startOfWeek } from '../lib/staffUtils'

export default function MyHoursPanel({ employees, timeEntries }) {
  const { t } = useLanguage()
  const [selectedId, setSelectedId] = useState('')
  const [pinInput, setPinInput] = useState('')
  const [unlockedId, setUnlockedId] = useState(null)
  const [error, setError] = useState('')

  const selectedEmployee = employees.find((e) => e.id === selectedId)

  function handleCheck(e) {
    e.preventDefault()
    setError('')
    if (!selectedEmployee) return
    if (selectedEmployee.pin && pinInput !== selectedEmployee.pin) {
      setError(t('staff.wrongPin'))
      return
    }
    setUnlockedId(selectedEmployee.id)
  }

  function reset() {
    setUnlockedId(null)
    setSelectedId('')
    setPinInput('')
    setError('')
  }

  if (unlockedId) {
    const emp = employees.find((e) => e.id === unlockedId)
    const myEntries = timeEntries.filter((e) => e.employee_id === unlockedId)
    const weekStart = startOfWeek()
    const monthStart = startOfMonth()
    const recent = [...myEntries]
      .sort((a, b) => new Date(b.clock_in) - new Date(a.clock_in))
      .slice(0, 10)

    return (
      <div className="bg-graphite border border-steel rounded-md p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg text-chalk">{t('staff.myHoursTitle', emp?.name)}</h3>
          <button onClick={reset} className="text-sm text-chalkdim hover:text-chalk underline">
            {t('staff.done')}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-chalkdim text-sm mb-1">{t('staff.colThisWeek')}</div>
            <div className="font-display text-2xl text-brasslight">
              {formatHours(hoursWorkedSince(myEntries, unlockedId, weekStart))}
            </div>
          </div>
          <div>
            <div className="text-chalkdim text-sm mb-1">{t('staff.colThisMonth')}</div>
            <div className="font-display text-2xl text-brasslight">
              {formatHours(hoursWorkedSince(myEntries, unlockedId, monthStart))}
            </div>
          </div>
        </div>

        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {recent.map((entry) => (
            <div key={entry.id} className="flex justify-between text-sm border-t border-steel pt-2">
              <span className="text-chalkdim">{formatDate(entry.clock_in)}</span>
              <span className="text-chalk">
                {entry.clock_out ? formatHours(computeHours(entry.clock_in, entry.clock_out)) : t('staff.clockedIn')}
              </span>
            </div>
          ))}
          {recent.length === 0 && <p className="text-chalkdim text-sm">{t('staff.noShiftsYet')}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-graphite border border-steel rounded-md p-5">
      <h3 className="font-display text-lg text-chalk mb-3">{t('staff.myHours')}</h3>
      <form onSubmit={handleCheck} className="space-y-3 max-w-sm">
        <select
          value={selectedId}
          onChange={(e) => {
            setSelectedId(e.target.value)
            setError('')
          }}
          className="w-full rounded-md bg-ink border border-steel px-3 py-2 text-chalk focus:border-brass outline-none"
        >
          <option value="">{t('staff.selectYourName')}</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
        </select>

        {selectedEmployee?.pin && (
          <input
            type="password"
            inputMode="numeric"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
            placeholder={t('staff.enterPin')}
            className="w-full rounded-md bg-ink border border-steel px-3 py-2 text-chalk focus:border-brass outline-none"
          />
        )}

        {error && <p className="text-rust text-sm">{error}</p>}

        <button
          type="submit"
          disabled={!selectedEmployee}
          className="w-full bg-brass hover:bg-brasslight text-ink font-semibold px-4 py-2 rounded-md disabled:opacity-60 transition-colors"
        >
          {t('staff.viewMyHours')}
        </button>
      </form>
    </div>
  )
}
