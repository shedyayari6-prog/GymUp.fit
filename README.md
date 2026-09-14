# GymUp

A membership-tracking dashboard for gym owners: add members with a photo and
subscription length, get alerted as memberships approach expiry, see expired
members separated into their own list, and track monthly earnings on a chart.

Stack: **React (Vite) + Tailwind CSS** on the front end, **Supabase**
(Postgres + Auth + Storage) as the backend.

## 1. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Once it's ready, open **Project Settings → API**. You'll need:
   - `Project URL`
   - `anon public` key
3. Open the **SQL Editor**, paste the entire contents of
   `supabase/schema.sql` from this project, and run it. This creates:
   - the `members` table
   - row-level security policies (each gym owner only ever sees their own members)
   - a public `member-photos` storage bucket with per-owner upload permissions

That's the whole backend — no server code to deploy.

> Note on auth emails: by default Supabase requires email confirmation on
> sign-up. For quick local testing you can turn this off in
> **Authentication → Providers → Email → Confirm email**, or just check the
> inbox you sign up with.

## 2. Configure the front end

```bash
cd gymup
npm install
cp .env.example .env
```

Open `.env` and fill in the two values from step 1:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

## 3. Run it

```bash
npm run dev
```

Visit the printed local URL, create a gym owner account on the Sign Up page,
and start adding members.

## How it works

- **Auth**: one Supabase Auth user = one gym owner. The gym name is stored
  on the user's metadata at sign-up.
- **Adding a member**: name, age, monthly fee, a start date, and a duration
  (1/3/6/12 months). The app computes the end date automatically
  (`src/lib/memberUtils.js`) and stores it, so lookups are cheap.
- **Alerts & lists**: on every dashboard load, each member's end date is
  compared to today. Members ending within 3 days trigger the orange
  banner and a badge in the sidebar; members whose end date has already
  passed disappear from "Active members" and appear under "Expired
  members" automatically — no manual moving of records.
- **Renewing** an expired member reopens the same form pre-filled, so the
  owner just picks a new start date/duration instead of re-typing everything.
- **Earnings chart**: groups all members by the month of their `start_date`
  (i.e. the month they joined or renewed) and sums the monthly fee for that
  month, rendered with Recharts.
- **Photos**: uploaded straight to the `member-photos` Supabase Storage
  bucket under a folder named after the owner's user id, so storage-level
  policies keep gyms from touching each other's files.

## Where to extend this next

- Add a "days since joined" retention view.
- Email/SMS reminders (Supabase Edge Function + a cron trigger, checking
  for `end_date` within N days).
- Multiple staff logins per gym (would need a `gym_id` table separate from
  `auth.users`, with staff invited as sub-accounts).
- Payment history as its own table instead of inferring earnings from
  membership start dates, if members can pay at irregular times.
