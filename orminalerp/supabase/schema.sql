-- Orminal ERP — partner portal schema
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query).

create table if not exists public.partners (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  company_name text not null,
  contact_name text not null,
  phone text,
  country text,
  city text,
  activity text,
  website text,
  commercial_register text,
  employees_count integer,
  notes text,
  tier text not null default 'silver',
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.partners is 'Partner companies registered through the Orminal ERP website.';

alter table public.partners enable row level security;

-- A partner can read and maintain only their own row.
drop policy if exists "partners_select_own" on public.partners;
create policy "partners_select_own" on public.partners
  for select using (auth.uid() = id);

drop policy if exists "partners_insert_own" on public.partners;
create policy "partners_insert_own" on public.partners
  for insert with check (auth.uid() = id);

drop policy if exists "partners_update_own" on public.partners;
create policy "partners_update_own" on public.partners
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Keep updated_at fresh.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists partners_touch_updated_at on public.partners;
create trigger partners_touch_updated_at
  before update on public.partners
  for each row execute function public.touch_updated_at();

-- Optional: mirror auth signup metadata into public.partners automatically.
create or replace function public.handle_new_partner()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if coalesce(new.raw_user_meta_data ->> 'role', '') = 'partner' then
    insert into public.partners (
      id, email, company_name, contact_name, phone, country, city,
      activity, website, commercial_register, employees_count, notes
    ) values (
      new.id,
      new.email,
      coalesce(new.raw_user_meta_data ->> 'company_name', '—'),
      coalesce(new.raw_user_meta_data ->> 'contact_name', '—'),
      new.raw_user_meta_data ->> 'phone',
      new.raw_user_meta_data ->> 'country',
      new.raw_user_meta_data ->> 'city',
      new.raw_user_meta_data ->> 'activity',
      new.raw_user_meta_data ->> 'website',
      new.raw_user_meta_data ->> 'commercial_register',
      nullif(new.raw_user_meta_data ->> 'employees_count', '')::integer,
      new.raw_user_meta_data ->> 'notes'
    )
    on conflict (id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_partner on auth.users;
create trigger on_auth_user_created_partner
  after insert on auth.users
  for each row execute function public.handle_new_partner();
