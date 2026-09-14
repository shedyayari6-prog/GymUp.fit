import { formatDate, daysUntil } from '../lib/memberUtils'
import { useLanguage } from '../context/LanguageContext'

export default function ExpiredTable({ members, onRenew, onDelete }) {
  const { t } = useLanguage()

  if (members.length === 0) {
    return (
      <div className="border border-dashed border-steel rounded-md py-16 text-center text-chalkdim">
        {t('expiredTable.empty')}
      </div>
    )
  }

  return (
    <div className="border border-steel rounded-md overflow-hidden">
      <table className="w-full text-start">
        <thead className="bg-graphite text-chalkdim text-sm">
          <tr>
            <th className="px-4 py-3 font-medium">{t('expiredTable.colMember')}</th>
            <th className="px-4 py-3 font-medium">{t('expiredTable.colEndedOn')}</th>
            <th className="px-4 py-3 font-medium">{t('expiredTable.colDaysAgo')}</th>
            <th className="px-4 py-3 font-medium text-end">{t('expiredTable.colActions')}</th>
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
              <td className="px-4 py-3 text-chalkdim">{formatDate(m.end_date)}</td>
              <td className="px-4 py-3 text-rust">{Math.abs(daysUntil(m.end_date))}d</td>
              <td className="px-4 py-3 text-end whitespace-nowrap">
                <button
                  onClick={() => onRenew(m)}
                  className="text-sm text-brasslight hover:underline me-4"
                >
                  {t('expiredTable.renew')}
                </button>
                <button
                  onClick={() => onDelete(m)}
                  className="text-sm text-rust hover:underline"
                >
                  {t('expiredTable.delete')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
