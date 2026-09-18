import { formatHours, hoursWorkedSince, startOfMonth, startOfWeek } from '../lib/staffUtils'
import { useLanguage } from '../context/LanguageContext'

export default function StaffTable({ employees, timeEntries, onEdit, onDelete }) {
  const { t } = useLanguage()

  if (employees.length === 0) {
    return (
      <div className="border border-dashed border-steel rounded-md py-16 text-center text-chalkdim">
        {t('staff.noEmployeesTable')}
      </div>
    )
  }

  const weekStart = startOfWeek()
  const monthStart = startOfMonth()

  return (
    <div className="border border-steel rounded-md overflow-hidden">
      <table className="w-full text-start">
        <thead className="bg-graphite text-chalkdim text-sm">
          <tr>
            <th className="px-4 py-3 font-medium">{t('staff.colName')}</th>
            <th className="px-4 py-3 font-medium">{t('staff.colRate')}</th>
            <th className="px-4 py-3 font-medium">{t('staff.colThisWeek')}</th>
            <th className="px-4 py-3 font-medium">{t('staff.colThisMonth')}</th>
            <th className="px-4 py-3 font-medium text-end">{t('membersTable.colActions')}</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} className="border-t border-steel hover:bg-graphite/50 transition-colors">
              <td className="px-4 py-3 text-chalk font-medium">{emp.name}</td>
              <td className="px-4 py-3 text-chalkdim">{Number(emp.hourly_rate || 0).toFixed(2)} TND/h</td>
              <td className="px-4 py-3 text-chalkdim">
                {formatHours(hoursWorkedSince(timeEntries, emp.id, weekStart))}
              </td>
              <td className="px-4 py-3 text-chalkdim">
                {formatHours(hoursWorkedSince(timeEntries, emp.id, monthStart))}
              </td>
              <td className="px-4 py-3 text-end whitespace-nowrap">
                <button
                  onClick={() => onEdit(emp)}
                  className="text-sm text-brasslight hover:underline me-4"
                >
                  {t('membersTable.edit')}
                </button>
                <button
                  onClick={() => onDelete(emp)}
                  className="text-sm text-rust hover:underline"
                >
                  {t('membersTable.delete')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
