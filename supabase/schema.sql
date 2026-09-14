-- Run this whole file in the Supabase SQL editor (Project > SQL Editor > New query)
-- It sets up the members table, row-level security, and a public storage
-- bucket for member photos.

-- 1. MEMBERS TABLE ----------------------------------------------------------

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  age int,
  photo_url text,
  membership_price numeric(10,2) default 0,
  start_date date not null default current_date,
  duration_months int not null default 1,
  end_date date not null,
  created_at timestamptz not null default now()
);

create index if not exists members_owner_id_idx on public.members(owner_id);
create index if not exists members_end_date_idx on public.members(end_date);

-- 2. ROW LEVEL SECURITY ------------------------------------------------------
-- Every gym owner can only ever see and modify their own members.

alter table public.members enable row level security;

drop policy if exists "Owners can view their own members" on public.members;
create policy "Owners can view their own members"
  on public.members for select
  using (auth.uid() = owner_id);

drop policy if exists "Owners can insert their own members" on public.members;
create policy "Owners can insert their own members"
  on public.members for insert
  with check (auth.uid() = owner_id);

drop policy if exists "Owners can update their own members" on public.members;
create policy "Owners can update their own members"
  on public.members for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists "Owners can delete their own members" on public.members;
create policy "Owners can delete their own members"
  on public.members for delete
  using (auth.uid() = owner_id);

-- 3. STORAGE BUCKET FOR MEMBER PHOTOS ---------------------------------------

insert into storage.buckets (id, name, public)
values ('member-photos', 'member-photos', true)
on conflict (id) do nothing;

-- Anyone can view photos (bucket is public), but only the owning gym
-- can upload/update/delete files inside their own folder (folder name
-- is the owner's user id, enforced by the app when it builds the path).

drop policy if exists "Public can view member photos" on storage.objects;
create policy "Public can view member photos"
  on storage.objects for select
  using (bucket_id = 'member-photos');

drop policy if exists "Owners can upload their own member photos" on storage.objects;
create policy "Owners can upload their own member photos"
  on storage.objects for insert
  with check (
    bucket_id = 'member-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Owners can update their own member photos" on storage.objects;
create policy "Owners can update their own member photos"
  on storage.objects for update
  using (
    bucket_id = 'member-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Owners can delete their own member photos" on storage.objects;
create policy "Owners can delete their own member photos"
  on storage.objects for delete
  using (
    bucket_id = 'member-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
