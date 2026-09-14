import { useMemo, useState } from 'react'
import { supabase } from '../supabaseClient'
import { computeEndDate, formatDate } from '../lib/memberUtils'
import { useLanguage } from '../context/LanguageContext'

const todayStr = () => new Date().toISOString().slice(0, 10)

// mode: 'edit' (default) lets you freely correct any field, including
// picking a start date/duration by hand. mode: 'renew' is used from the
// "Renew" button on expired members — there you only choose how many
// months to add, and the new period always starts exactly on the day the
// old one ended, so there's never a manual date to get wrong or a gap
// between periods.
export default function MemberModal({ existing, ownerId, mode = 'edit', onClose, onSaved }) {
  const { t } = useLanguage()
  const isRenew = Boolean(existing) && mode === 'renew'

  const [name, setName] = useState(existing?.name ?? '')
  const [age, setAge] = useState(existing?.age ?? '')
  const [phone, setPhone] = useState(existing?.phone ?? '')
  const [price, setPrice] = useState(existing?.membership_price ?? '')
  const [startDate, setStartDate] = useState(existing?.start_date ?? todayStr())
  const [duration, setDuration] = useState(existing?.duration_months ?? 1)
  const [monthsToAdd, setMonthsToAdd] = useState(1)
  const [photoFile, setPhotoFile] = useState(null)
  const [preview, setPreview] = useState(existing?.photo_url ?? null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  // In renew mode, the new start date is always the old end date — never
  // typed by hand — so back-to-back periods can't overlap or leave a gap.
  const renewStartDate = existing?.end_date ?? todayStr()
  const renewEndDate = useMemo(
    () => computeEndDate(renewStartDate, monthsToAdd),
    [renewStartDate, monthsToAdd]
  )

  function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPreview(URL.createObjectURL(file))
  }

  async function uploadPhoto() {
    if (!photoFile) return existing?.photo_url ?? null
    const ext = photoFile.name.split('.').pop()
    const path = `${ownerId}/${crypto.randomUUID()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('member-photos')
      .upload(path, photoFile, { upsert: true })
    if (uploadError) throw uploadError
    const { data } = supabase.storage.from('member-photos').getPublicUrl(path)
    return data.publicUrl
  }

  // A "charge event" is a brand new member, an explicit renewal, or an
  // existing member whose start date/duration was hand-edited to a
  // different value. Editing just the name/age/photo doesn't log a new
  // payment, since nothing was actually charged. This ledger is what the
  // earnings and loyalty charts read from, and it's never touched by
  // later edits or by deleting the member.
  async function logPaymentIfChargeEvent(memberId, effectiveStart, effectiveDuration, effectiveAmount) {
    const isNew = !existing
    const periodChanged =
      existing &&
      (existing.start_date !== effectiveStart || Number(existing.duration_months) !== Number(effectiveDuration))

    if (!isNew && !isRenew && !periodChanged) return

    const { error: paymentError } = await supabase.from('payments').insert({
      owner_id: ownerId,
      member_id: memberId,
      member_name: name,
      amount: effectiveAmount,
      paid_at: effectiveStart,
      duration_months: Number(effectiveDuration)
    })
    if (paymentError) throw paymentError
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const photoUrl = await uploadPhoto()
      const amount = price === '' ? 0 : Number(price)

      const effectiveStart = isRenew ? renewStartDate : startDate
      const effectiveDuration = isRenew ? Number(monthsToAdd) : Number(duration)
      const effectiveEnd = isRenew ? renewEndDate : computeEndDate(startDate, duration)

      const payload = {
        owner_id: ownerId,
        name,
        age: age === '' ? null : Number(age),
        phone: phone === '' ? null : phone,
        membership_price: amount,
        start_date: effectiveStart,
        duration_months: effectiveDuration,
        end_date: effectiveEnd,
        photo_url: photoUrl
      }

      let saveError
      let memberId = existing?.id

      if (existing) {
        ;({ error: saveError } = await supabase
          .from('members')
          .update(payload)
          .eq('id', existing.id))
      } else {
        const { data: inserted, error: insertError } = await supabase
          .from('members')
          .insert(payload)
          .select()
          .single()
        saveError = insertError
        memberId = inserted?.id
      }

      if (saveError) throw saveError

      await logPaymentIfChargeEvent(memberId, effectiveStart, effectiveDuration, amount)
      onSaved()
    } catch (err) {
      setError(err.message ?? 'Something went wrong while saving.')
    } finally {
      setBusy(false)
    }
  }

  const title = isRenew
    ? t('memberModal.titleRenew')
    : existing
    ? t('memberModal.titleEdit')
    : t('memberModal.titleAdd')

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-graphite border border-steel rounded-md w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="font-display text-2xl text-chalk mb-5">{title}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-steel overflow-hidden shrink-0 flex items-center justify-center text-chalkdim text-xs">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                t('memberModal.noPhoto')
              )}
            </div>
            <label className="text-sm text-brasslight cursor-pointer hover:underline">
              {t('memberModal.uploadPhoto')}
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </label>
          </div>

          <div>
            <label className="block text-chalkdim text-sm mb-1">{t('memberModal.fullName')}</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md bg-ink border border-steel px-3 py-2 text-chalk focus:border-brass outline-none"
            />
          </div>

          <div>
            <label className="block text-chalkdim text-sm mb-1">{t('memberModal.phone')}</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+216 12 345 678"
              className="w-full rounded-md bg-ink border border-steel px-3 py-2 text-chalk focus:border-brass outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-chalkdim text-sm mb-1">{t('memberModal.age')}</label>
              <input
                type="number"
                min="10"
                max="100"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full rounded-md bg-ink border border-steel px-3 py-2 text-chalk focus:border-brass outline-none"
              />
            </div>
            <div>
              <label className="block text-chalkdim text-sm mb-1">{t('memberModal.monthlyFee')}</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-md bg-ink border border-steel px-3 py-2 text-chalk focus:border-brass outline-none"
              />
            </div>
          </div>

          {isRenew ? (
            <div className="rounded-md border border-steel bg-ink p-4 space-y-3">
              <p className="text-sm text-chalkdim">
                {t('memberModal.renewingFrom', formatDate(renewStartDate))}
              </p>
              <div>
                <label className="block text-chalkdim text-sm mb-1">{t('memberModal.monthsToAdd')}</label>
                <select
                  value={monthsToAdd}
                  onChange={(e) => setMonthsToAdd(e.target.value)}
                  className="w-full rounded-md bg-graphite border border-steel px-3 py-2 text-chalk focus:border-brass outline-none"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {t('memberModal.month', m)}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-sm font-medium text-brasslight">
                {t('memberModal.endsOn', formatDate(renewEndDate))}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-chalkdim text-sm mb-1">{t('memberModal.startDate')}</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-md bg-ink border border-steel px-3 py-2 text-chalk focus:border-brass outline-none"
                />
              </div>
              <div>
                <label className="block text-chalkdim text-sm mb-1">{t('memberModal.duration')}</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full rounded-md bg-ink border border-steel px-3 py-2 text-chalk focus:border-brass outline-none"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {t('memberModal.month', m)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {error && <p className="text-rust text-sm">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-chalkdim hover:text-chalk transition-colors"
            >
              {t('memberModal.cancel')}
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-5 py-2 rounded-md bg-brass hover:bg-brasslight text-ink font-semibold transition-colors disabled:opacity-60"
            >
              {busy
                ? t('memberModal.saving')
                : isRenew
                ? t('memberModal.titleRenew')
                : existing
                ? t('memberModal.saveChanges')
                : t('memberModal.addMember')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}