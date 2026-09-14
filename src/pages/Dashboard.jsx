import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import Sidebar from '../components/Sidebar'
import StatCard from '../components/StatCard'
import ExpiryAlertBanner from '../components/ExpiryAlertBanner'
import MembersTable from '../components/MembersTable'
import ExpiredTable from '../components/ExpiredTable'
import EarningsChart from '../components/EarningsChart'
import LoyaltyChart from '../components/LoyaltyChart'
import MemberModal from '../components/MemberModal'
import MemberSearch from '../components/MemberSearch'
import MemberDetailModal from '../components/MemberDetailModal'
import AgeBreakdownChart from '../components/AgeBreakdownChart'
import RenewalRateWidget from '../components/RenewalRateWidget'
import QuickNotes from '../components/QuickNotes'
import { membershipStatus } from '../lib/memberUtils'

// ---------- Earnings Password Gate (inline component) ----------
function EarningsPasswordGate({ ownerId, onUnlock, forceSetup = false }) {
  const { t } = useLanguage()
  const [storedPassword, setStoredPassword] = useState(null)
  const [loading, setLoading] = useState(true)
  const [input, setInput] = useState('')
  const [confirmInput, setConfirmInput] = useState('')
  const [error, setError] = useState('')
  const [setupMode, setSetupMode] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('earnings_password')
        .eq('id', ownerId)
        .maybeSingle()
      if (cancelled) return
      if (error) console.error('Failed to load earnings password:', error.message)
      setStoredPassword(data?.earnings_password ?? null)
      setSetupMode(forceSetup || !data?.earnings_password)
      setLoading(false)
    }
    if (ownerId) load()
    return () => { cancelled = true }
  }, [ownerId, forceSetup])

  async function handleSetPassword(e) {
    e.preventDefault()
    setError('')
    if (!input.trim()) {
      setError(t('earnings.passwordRequired'))
      return
    }
    if (input !== confirmInput) {
      setError(t('earnings.passwordMismatch'))
      return
    }
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: ownerId, earnings_password: input }, { onConflict: 'id' })
    if (error) {
      setError(error.message)
      return
    }
    setStoredPassword(input)
    setSetupMode(false)
    setInput('')
    setConfirmInput('')
    onUnlock()
  }

  function handleUnlock(e) {
    e.preventDefault()
    setError('')
    if (input === storedPassword) {
      setInput('')
      onUnlock()
    } else {
      setError(t('earnings.wrongPassword'))
    }
  }

  if (loading) {
    return <p className="text-chalkdim">{t('dashboard.loading')}</p>
  }

  return (
    <div className="max-w-md mx-auto mt-16 bg-steel/40 border border-steel rounded-lg p-8">
      <h2 className="font-display text-2xl text-chalk mb-2">
        {setupMode ? t('earnings.setupTitle') : t('earnings.lockedTitle')}
      </h2>
      <p className="text-chalkdim text-sm mb-6">
        {setupMode ? t('earnings.setupHint') : t('earnings.lockedHint')}
      </p>

      <form onSubmit={setupMode ? handleSetPassword : handleUnlock} className="space-y-4">
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={setupMode ? t('earnings.newPassword') : t('earnings.enterPassword')}
          className="w-full bg-ink border border-steel rounded-md px-3 py-2 text-chalk focus:outline-none focus:border-brass"
          autoFocus
        />
        {setupMode && (
          <input
            type="password"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            placeholder={t('earnings.confirmPassword')}
            className="w-full bg-ink border border-steel rounded-md px-3 py-2 text-chalk focus:outline-none focus:border-brass"
          />
        )}
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-brass hover:bg-brasslight transition-colors text-ink font-semibold px-5 py-2.5 rounded-md"
        >
          {setupMode ? t('earnings.savePassword') : t('earnings.unlock')}
        </button>
      </form>
    </div>
  )
}

// ---------- Dashboard ----------
export default function Dashboard() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [members, setMembers] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('active')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('edit')
  const [editingMember, setEditingMember] = useState(null)
  const [detailMember, setDetailMember] = useState(null)

  // Earnings password gate state
  const [earningsUnlocked, setEarningsUnlocked] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  const gymName = user?.user_metadata?.gym_name

  async function fetchMembers() {
    setLoading(true)
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setMembers(data ?? [])
    setLoading(false)
  }

  async function fetchPayments() {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('paid_at', { ascending: true })
    if (!error) setPayments(data ?? [])
  }

  useEffect(() => {
    fetchMembers()
    fetchPayments()
  }, [])

  // Re-lock earnings whenever the user leaves the tab
  useEffect(() => {
    if (tab !== 'earnings') {
      setEarningsUnlocked(false)
      setChangingPassword(false)
    }
  }, [tab])

  const { activeMembers, expiredMembers, expiringSoon } = useMemo(() => {
    const active = []
    const expired = []
    const expiring = []
    members.forEach((m) => {
      const status = membershipStatus(m.end_date)
      if (status === 'expired') expired.push(m)
      else {
        active.push(m)
        if (status === 'expiring') expiring.push(m)
      }
    })
    return { activeMembers: active, expiredMembers: expired, expiringSoon: expiring }
  }, [members])

  function openAddModal() {
    setEditingMember(null)
    setModalMode('edit')
    setModalOpen(true)
  }

  function openEditModal(member) {
    setEditingMember(member)
    setModalMode('edit')
    setModalOpen(true)
  }

  function openRenewModal(member) {
    setEditingMember(member)
    setModalMode('renew')
    setModalOpen(true)
  }

  async function handleDelete(member) {
    if (!confirm(t('dashboard.confirmDelete', member.name))) return

    // Grace period: if this member was billed within the last 24 hours,
    // remove that payment too — deleting a member shouldn't leave phantom
    // earnings behind if it was just a quick mistake. Anything older than
    // 24 hours is locked in as real history (the payments table's RLS
    // policy enforces this too, so this call is a no-op on old rows even
    // if something tries to bypass it).
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { error: paymentsError } = await supabase
      .from('payments')
      .delete()
      .eq('member_id', member.id)
      .gte('created_at', cutoff)
    if (paymentsError) {
      console.error('Failed to clean up recent payments:', paymentsError.message)
    }

    const { error } = await supabase.from('members').delete().eq('id', member.id)
    if (error) {
      console.error('Delete failed:', error.message)
      return
    }
    fetchMembers()
    fetchPayments()
  }

  function handleSaved() {
    setModalOpen(false)
    setEditingMember(null)
    fetchMembers()
    fetchPayments()
  }

  function openDetailFromSearch(member) {
    setDetailMember(member)
  }

  function handleEditFromDetail(member) {
    setDetailMember(null)
    openEditModal(member)
  }

  async function handleDeleteFromDetail(member) {
    setDetailMember(null)
    await handleDelete(member)
  }

  return (
    <div className="min-h-screen bg-ink flex">
      <Sidebar
        current={tab}
        onChange={setTab}
        gymName={gymName}
        ownerId={user?.id}
        expiredCount={expiredMembers.length}
        expiringCount={expiringSoon.length}
      />

      <div className="flex-1 flex flex-col xl:flex-row">
        <main className="flex-1 p-8 max-w-6xl">
          <div className="flex items-center justify-between gap-6 mb-6">
            <h1 className="font-display text-3xl text-chalk shrink-0">
              {tab === 'active' && t('dashboard.headingActive')}
              {tab === 'expired' && t('dashboard.headingExpired')}
              {tab === 'earnings' && t('dashboard.headingEarnings')}
            </h1>
            <MemberSearch members={members} onSelect={openDetailFromSearch} />
            {tab !== 'earnings' && (
              <button
                onClick={openAddModal}
                className="bg-brass hover:bg-brasslight transition-colors text-ink font-semibold px-5 py-2.5 rounded-md shrink-0"
              >
                {t('dashboard.addMember')}
              </button>
            )}
            {tab === 'earnings' && earningsUnlocked && !changingPassword && (
              <button
                onClick={() => setChangingPassword(true)}
                className="text-chalkdim hover:text-chalk text-sm underline shrink-0"
              >
                {t('earnings.changePassword')}
              </button>
            )}
          </div>

          {tab === 'active' && (
            <>
              <ExpiryAlertBanner
                expiringSoon={expiringSoon}
                justExpired={expiredMembers}
                onViewExpired={() => setTab('expired')}
              />
              <div className="grid grid-cols-3 gap-4 mb-6">
                <StatCard label={t('dashboard.statActive')} value={activeMembers.length} />
                <StatCard label={t('dashboard.statExpiring')} value={expiringSoon.length} accent />
                <StatCard label={t('dashboard.statExpired')} value={expiredMembers.length} />
              </div>
              {loading ? (
                <p className="text-chalkdim">{t('dashboard.loading')}</p>
              ) : (
                <MembersTable members={activeMembers} onEdit={openEditModal} onDelete={handleDelete} />
              )}
            </>
          )}

          {tab === 'expired' && (
            <>
              {loading ? (
                <p className="text-chalkdim">{t('dashboard.loading')}</p>
              ) : (
                <ExpiredTable members={expiredMembers} onRenew={openRenewModal} onDelete={handleDelete} />
              )}
            </>
          )}

          {tab === 'earnings' && (
            <>
              {changingPassword ? (
                <EarningsPasswordGate
                  ownerId={user.id}
                  forceSetup
                  onUnlock={() => {
                    setChangingPassword(false)
                    setEarningsUnlocked(true)
                  }}
                />
              ) : !earningsUnlocked ? (
                <EarningsPasswordGate
                  ownerId={user.id}
                  onUnlock={() => setEarningsUnlocked(true)}
                />
              ) : (
                <>
                  <EarningsChart payments={payments} />
                  <div className="mt-10">
                    <LoyaltyChart payments={payments} />
                  </div>
                </>
              )}
            </>
          )}
        </main>

        <aside className="xl:w-80 shrink-0 p-8 xl:border-s border-steel space-y-6">
          <AgeBreakdownChart members={activeMembers} />
          <RenewalRateWidget payments={payments} />
          <QuickNotes ownerId={user?.id} />
        </aside>
      </div>

      {modalOpen && (
        <MemberModal
          existing={editingMember}
          ownerId={user.id}
          mode={modalMode}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}

      {detailMember && (
        <MemberDetailModal
          member={detailMember}
          onClose={() => setDetailMember(null)}
          onEdit={handleEditFromDetail}
          onDelete={handleDeleteFromDetail}
        />
      )}
    </div>
  )
}