-- ============================================================
-- Gym Lead Generation Platform - initial schema
-- Run this in the Supabase SQL editor or via `supabase db push`
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- profiles: one row per auth user, carries the role
-- ------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'member' check (role in ('member', 'admin')),
  goal text,
  height_cm numeric,
  target_weight_kg numeric,
  daily_water_goal_ml integer not null default 2500,
  created_at timestamptz not null default now()
);

-- Auto-create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper used by RLS policies (security definer avoids recursive RLS)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ------------------------------------------------------------
-- leads: every captured lead, regardless of source
-- ------------------------------------------------------------
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  city text,
  goal text,
  bmi numeric,
  source text not null default 'website' check (
    source in (
      'website', 'bmi_calculator', 'assessment', 'trial_booking',
      'consultation', 'exit_intent', 'whatsapp', 'signup'
    )
  ),
  status text not null default 'new' check (
    status in ('new', 'contacted', 'trial', 'converted', 'lost')
  ),
  notes text,
  created_at timestamptz not null default now()
);

create index leads_created_at_idx on public.leads (created_at desc);
create index leads_source_idx on public.leads (source);
create index leads_status_idx on public.leads (status);

-- ------------------------------------------------------------
-- fitness_assessments: quiz responses
-- ------------------------------------------------------------
create table public.fitness_assessments (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads (id) on delete set null,
  user_id uuid references auth.users (id) on delete set null,
  goal text not null check (goal in ('weight_loss', 'muscle_gain', 'general_fitness')),
  answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- trial_bookings: free trial requests
-- ------------------------------------------------------------
create table public.trial_bookings (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads (id) on delete set null,
  name text not null,
  email text not null,
  phone text not null,
  location text not null,
  goal text not null,
  preferred_date date,
  status text not null default 'pending' check (
    status in ('pending', 'confirmed', 'completed', 'no_show')
  ),
  created_at timestamptz not null default now()
);

create index trial_bookings_created_at_idx on public.trial_bookings (created_at desc);

-- ------------------------------------------------------------
-- member tracking tables
-- ------------------------------------------------------------
create table public.workout_streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  workout_date date not null default current_date,
  created_at timestamptz not null default now(),
  unique (user_id, workout_date)
);

create table public.weight_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  weight_kg numeric not null check (weight_kg > 0),
  bmi numeric,
  logged_on date not null default current_date,
  created_at timestamptz not null default now()
);

create index weight_logs_user_idx on public.weight_logs (user_id, logged_on);

create table public.water_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  amount_ml integer not null check (amount_ml > 0),
  logged_on date not null default current_date,
  created_at timestamptz not null default now()
);

create index water_logs_user_idx on public.water_logs (user_id, logged_on);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.fitness_assessments enable row level security;
alter table public.trial_bookings enable row level security;
alter table public.workout_streaks enable row level security;
alter table public.weight_logs enable row level security;
alter table public.water_logs enable row level security;

-- profiles ----------------------------------------------------
create policy "Users read own profile, admins read all"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "Users update own profile"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

-- leads -------------------------------------------------------
-- Public lead capture: anyone may submit a lead
create policy "Anyone can submit a lead"
  on public.leads for insert
  to anon, authenticated
  with check (true);

create policy "Admins read leads"
  on public.leads for select
  using (public.is_admin());

create policy "Admins update leads"
  on public.leads for update
  using (public.is_admin());

create policy "Admins delete leads"
  on public.leads for delete
  using (public.is_admin());

-- fitness_assessments ----------------------------------------
create policy "Anyone can submit an assessment"
  on public.fitness_assessments for insert
  to anon, authenticated
  with check (true);

create policy "Owners and admins read assessments"
  on public.fitness_assessments for select
  using (user_id = auth.uid() or public.is_admin());

-- trial_bookings ----------------------------------------------
create policy "Anyone can book a trial"
  on public.trial_bookings for insert
  to anon, authenticated
  with check (true);

create policy "Admins read bookings"
  on public.trial_bookings for select
  using (public.is_admin());

create policy "Admins update bookings"
  on public.trial_bookings for update
  using (public.is_admin());

-- tracking tables: owner-only CRUD, admins may read ----------
create policy "Owner manages workout streaks"
  on public.workout_streaks for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Admins read workout streaks"
  on public.workout_streaks for select
  using (public.is_admin());

create policy "Owner manages weight logs"
  on public.weight_logs for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Admins read weight logs"
  on public.weight_logs for select
  using (public.is_admin());

create policy "Owner manages water logs"
  on public.water_logs for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Admins read water logs"
  on public.water_logs for select
  using (public.is_admin());

-- ============================================================
-- Promote the gym owner to admin AFTER they have signed up:
--   update public.profiles set role = 'admin' where id = (
--     select id from auth.users where email = 'owner@example.com'
--   );
-- ============================================================
