import { useLanguage } from '../context/LanguageContext'
import { daysUntil, formatCurrency, formatDate, membershipStatus } from '../lib/memberUtils'

function StatusPill({ endDate }) {
  const { t } = useLanguage()
  const status = membershipStatus(endDate)
  const days = daysUntil(endDate)

  if (status === 'expired') {
    return (
      <span className="text-sm font-medium bg-rust/20 text-rust px-3 py-1 rounded-full">
        {t('search.detailExpiredAgo')(Math.abs(days))}
      </span>
    )
  }
  if (status === 'expiring') {
    return (
      <span className="text-sm font-medium bg-brasslight/20 text-brasslight px-3 py-1 rounded-full">
        {days === 0 ? t('membersTable.statusEndsToday') : t('membersTable.statusDaysLeft')(days)}
      </span>
    )
  }
  return (
    <span className="text-sm font-medium bg-good/20 text-good px-3 py-1 rounded-full">
      {t('membersTable.statusActive')}
    </span>
  )
}

export default function MemberDetailModal({ member, onClose, onEdit, onDelete }) {
  const { t } = useLanguage()
  if (!member) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-graphite border border-steel rounded-md w-full max-w-md p-6">
        <div className="flex items-start justify-between mb-5">
          <h2 className="font-display text-2xl text-chalk">{t('search.detailTitle')}</h2>
          <button onClick={onClose} className="text-chalkdim hover:text-chalk text-xl leading-none">
            ×
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-steel overflow-hidden shrink-0 flex items-center justify-center text-chalkdim text-xs">
            {member.photo_url ? (
              <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
            ) : (
              t('memberModal.noPhoto')
            )}
          </div>
          <div>
            <div className="font-display text-2xl text-chalk">{member.name}</div>
            <div className="mt-1">
              <StatusPill endDate={member.end_date} />
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-y-3 text-sm mb-6">
          <dt className="text-chalkdim">{t('memberModal.age')}</dt>
          <dd className="text-chalk text-end">{member.age ?? '—'}</dd>

          <dt className="text-chalkdim">{t('memberModal.phone')}</dt>
          <dd className="text-chalk text-end">
            {member.phone ? (
              <a href={`tel:${member.phone}`} className="text-brasslight hover:underline">
                {member.phone}
              </a>
            ) : (
              '—'
            )}
          </dd>

          <dt className="text-chalkdim">{t('memberModal.monthlyFee')}</dt>
          <dd className="text-chalk text-end">
            {member.membership_price ? formatCurrency(member.membership_price) : '—'}
          </dd>

          <dt className="text-chalkdim">{t('memberModal.startDate')}</dt>
          <dd className="text-chalk text-end">{formatDate(member.start_date)}</dd>

          <dt className="text-chalkdim">{t('search.detailEndDate')}</dt>
          <dd className="text-chalk text-end">{formatDate(member.end_date)}</dd>

          <dt className="text-chalkdim">{t('memberModal.duration')}</dt>
          <dd className="text-chalk text-end">{t('memberModal.month')(member.duration_months)}</dd>
        </dl>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => onDelete(member)}
            className="px-4 py-2 rounded-md text-rust hover:underline"
          >
            {t('membersTable.delete')}
          </button>
          <button
            onClick={() => onEdit(member)}
            className="px-5 py-2 rounded-md bg-brass hover:bg-brasslight text-ink font-semibold transition-colors"
          >
            {t('membersTable.edit')}
          </button>
        </div>
      </div>
    </div>
  )
}