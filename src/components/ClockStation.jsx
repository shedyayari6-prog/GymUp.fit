import { useMemo, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useLanguage } from '../context/LanguageContext'

export default function ClockStation({ employees, timeEntries, ownerId, onChanged }) {
  const { t } = useLanguage()
  const [selectedId, setSelectedId] = useState('')
  const [pinInput, setPinInput] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  // Map of employee_id -> their currently open shift, if any.
  const openEntryByEmployee = useMemo(() => {
    const map = {}
    timeEntries.forEach((e) => {
      if (!e.clock_out) map[e.employee_id] = e
    })
    return map
  }, [timeEntries])

  const selectedEmployee = employees.find((e) => e.id === selectedId)
  const isClockedIn = selectedEmployee && Boolean(openEntryByEmployee[selectedEmployee.id])

  function selectEmployee(emp) {
    setSelectedId(emp.id)
    setPinInput('')
    setError('')
  }

  async function handleClockAction() {
    if (!selectedEmployee) return
    if (selectedEmployee.pin && pinInput !== selectedEmployee.pin) {
      setError(t('staff.wrongPin'))
      return
    }

    setBusy(true)
    setError('')

    if (isClockedIn) {
      const entry = openEntryByEmployee[selectedEmployee.id]
      const { error } = await supabase
        .from('time_entries')
        .update({ clock_out: new Date().toISOString() })
        .eq('id', entry.id)
      if (error) setError(error.message)
    } else {
      const { error } = await supabase.from('time_entries').insert({
        owner_id: ownerId,
        employee_id: selectedEmployee.id,
        clock_in: new Date().toISOString()
      })
      if (error) setError(error.message)
    }

    setBusy(false)
    setSelectedId('')
    setPinInput('')
    onChanged()
  }

  return (
    <div className="bg-graphite border border-steel rounded-md p-5">
      <h3 className="font-display text-lg text-chalk mb-3">{t('staff.clockStation')}</h3>

      {!selectedEmployee ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {employees.map((emp) => {
            const clockedIn = Boolean(openEntryByEmployee[emp.id])
            return (
              <button
                key={emp.id}
                onClick={() => selectEmployee(emp)}
                className={`px-4 py-3 rounded-md border text-start transition-colors ${
                  clockedIn ? 'border-good bg-good/10' : 'border-steel bg-ink hover:border-brass'
                }`}
              >
                <div className="text-chalk font-medium truncate">{emp.name}</div>
                <div className={`text-xs mt-1 ${clockedIn ? 'text-good' : 'text-chalkdim'}`}>
                  {clockedIn ? t('staff.clockedIn') : t('staff.clockedOut')}
                </div>
              </button>
            )
          })}
          {employees.length === 0 && (
            <p className="text-chalkdim text-sm col-span-full">{t('staff.noEmployees')}</p>
          )}
        </div>
      ) : (
        <div className="space-y-3 max-w-sm">
          <div className="text-chalk font-medium">{selectedEmployee.name}</div>

          {selectedEmployee.pin && (
            <input
              type="password"
              inputMode="numeric"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
              placeholder={t('staff.enterPin')}
              className="w-full rounded-md bg-ink border border-steel px-3 py-2 text-chalk focus:border-brass outline-none"
              autoFocus
            />
          )}

          {error && <p className="text-rust text-sm">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={() => setSelectedId('')}
              className="flex-1 px-4 py-2 rounded-md text-chalkdim hover:text-chalk border border-steel transition-colors"
            >
              {t('memberModal.cancel')}
            </button>
            <button
              onClick={handleClockAction}
              disabled={busy}
              className={`flex-1 px-4 py-2 rounded-md font-semibold transition-colors disabled:opacity-60 ${
                isClockedIn
                  ? 'bg-rust text-chalk hover:opacity-90'
                  : 'bg-brass text-ink hover:bg-brasslight'
              }`}
            >
              {busy ? t('memberModal.saving') : isClockedIn ? t('staff.clockOut') : t('staff.clockIn')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
