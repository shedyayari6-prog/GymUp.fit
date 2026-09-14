import { daysUntil, formatCurrency, formatDate, membershipStatus } from '../lib/memberUtils'
import { useLanguage } from '../context/LanguageContext'

function StatusBadge({ endDate }) {
  const { t } = useLanguage()
  const status = membershipStatus(endDate)
  const days = daysUntil(endDate)

  if (status === 'expiring') {
    return (
      <span className="text-xs font-medium bg-brasslight/20 text-brasslight px-2.5 py-1 rounded-full">
        {days === 0 ? t('membersTable.statusEndsToday') : t('membersTable.statusDaysLeft')(days)}
      </span>
    )
  }
  return (
    <span className="text-xs font-medium bg-good/20 text-good px-2.5 py-1 rounded-full">
      {t('membersTable.statusActive')}
    </span>
  )
}

export default function MembersTable({ members, onEdit, onDelete }) {
  const { t } = useLanguage()

  if (members.length === 0) {
    return (
      <div className="border border-dashed border-steel rounded-md py-16 text-center text-chalkdim">
        {t('membersTable.empty')}
      </div>
    )
  }

  return (
    <div className="border border-steel rounded-md overflow-hidden">
      <table className="w-full text-start">
        <thead className="bg-graphite text-chalkdim text-sm">
          <tr>
            <th className="px-4 py-3 font-medium">{t('membersTable.colMember')}</th>
            <th className="px-4 py-3 font-medium">{t('membersTable.colAge')}</th>
            <th className="px-4 py-3 font-medium">{t('membersTable.colPhone')}</th>
            <th className="px-4 py-3 font-medium">{t('membersTable.colStarted')}</th>
            <th className="px-4 py-3 font-medium">{t('membersTable.colEnds')}</th>
            <th className="px-4 py-3 font-medium">{t('membersTable.colFee')}</th>
            <th className="px-4 py-3 font-medium">{t('membersTable.colStatus')}</th>
            <th className="px-4 py-3 font-medium text-end">{t('membersTable.colActions')}</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id} className="border-t border-steel hover:bg-graphite/50 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-steel overflow-hidden shrink-0">
                    {m.photo_url && (
                      <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <span className="text-chalk font-medium">{m.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-chalkdim">{m.age ?? '—'}</td>
              <td className="px-4 py-3 text-chalkdim">{m.phone || '—'}</td>
              <td className="px-4 py-3 text-chalkdim">{formatDate(m.start_date)}</td>
              <td className="px-4 py-3 text-chalkdim">{formatDate(m.end_date)}</td>
              <td className="px-4 py-3 text-chalkdim">
                {m.membership_price ? formatCurrency(m.membership_price) : '—'}
              </td>
              <td className="px-4 py-3">
                <StatusBadge endDate={m.end_date} />
              </td>
              <td className="px-4 py-3 text-end whitespace-nowrap">
                <button
                  onClick={() => onEdit(m)}
                  className="text-sm text-brasslight hover:underline me-4"
                >
                  {t('membersTable.edit')}
                </button>
                <button
                  onClick={() => onDelete(m)}
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