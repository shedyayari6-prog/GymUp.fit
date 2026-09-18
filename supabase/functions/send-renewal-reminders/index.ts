// supabase/functions/send-renewal-reminders/index.ts
//
// Runs on a daily schedule (set up via pg_cron, see supabase/cron.sql).
// Finds every member whose membership ends within the next 3 days, who
// has an email on file, and who hasn't already been emailed about THIS
// specific end date -- then sends them a reminder through Resend and
// marks them as reminded so they don't get the same email again tomorrow.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const FROM_EMAIL = Deno.env.get('REMINDER_FROM_EMAIL') ?? 'no-reply@gymup.fit'
const REMINDER_WINDOW_DAYS = 3

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

function buildEmailHtml(memberName: string, gymName: string, endDate: string) {
  return `
  <div style="background-color:#15161A; padding:40px 20px; font-family:Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" style="max-width:480px; margin:0 auto; background-color:#232429; border-radius:8px; overflow:hidden; border:1px solid #3A3B42;">
      <tr>
        <td style="padding:32px 32px 24px 32px; text-align:center;">
          <div style="font-size:22px; font-weight:700; letter-spacing:1px; color:#D4AF60;">${gymName}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:0 32px 8px 32px;">
          <h1 style="color:#EDEEF0; font-size:19px; margin:0 0 12px 0; font-weight:600;">
            Bonjour ${memberName}, votre abonnement arrive à expiration
          </h1>
          <p style="color:#B9BBC3; font-size:14px; line-height:1.6; margin:0 0 8px 0;">
            Votre abonnement chez ${gymName} se termine le <strong style="color:#D4AF60;">${formatDate(endDate)}</strong>.
          </p>
          <p style="color:#B9BBC3; font-size:14px; line-height:1.6; margin:0 0 24px 0;">
            Passez nous voir ou contactez-nous pour renouveler et garder votre place sans interruption dans votre entraînement.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:0 32px 32px 32px; border-top:1px solid #3A3B42;">
          <p style="color:#6b6d76; font-size:12px; line-height:1.6; margin:16px 0 0 0;">
            Ceci est un rappel automatique de ${gymName}.
          </p>
        </td>
      </tr>
    </table>
  </div>`
}

Deno.serve(async () => {
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const windowEnd = new Date(today)
  windowEnd.setDate(windowEnd.getDate() + REMINDER_WINDOW_DAYS)

  const todayStr = today.toISOString().slice(0, 10)
  const windowEndStr = windowEnd.toISOString().slice(0, 10)

  // Members expiring within the window, with an email on file, who
  // haven't already been reminded about this exact end date.
  const { data: members, error } = await supabase
    .from('members')
    .select('id, owner_id, name, email, end_date, last_reminder_sent_for')
    .gte('end_date', todayStr)
    .lte('end_date', windowEndStr)
    .not('email', 'is', null)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  const dueForReminder = (members ?? []).filter(
    (m) => m.last_reminder_sent_for !== m.end_date
  )

  let sent = 0
  const failures: string[] = []

  for (const member of dueForReminder) {
    // Look up the gym owner's name to personalize the email.
    const { data: ownerData } = await supabase.auth.admin.getUserById(member.owner_id)
    const gymName = ownerData?.user?.user_metadata?.gym_name || 'Votre salle'

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `${gymName} <${FROM_EMAIL}>`,
        to: member.email,
        subject: `Votre abonnement chez ${gymName} arrive à expiration`,
        html: buildEmailHtml(member.name, gymName, member.end_date)
      })
    })

    if (emailRes.ok) {
      sent += 1
      await supabase
        .from('members')
        .update({ last_reminder_sent_for: member.end_date })
        .eq('id', member.id)
    } else {
      failures.push(`${member.name} (${member.id}): ${await emailRes.text()}`)
    }
  }

  return new Response(
    JSON.stringify({ checked: dueForReminder.length, sent, failures }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})