-- MOZ MVP schema + RLS
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('restaurant', 'waiter')),
  created_at timestamptz not null default now()
);

create table if not exists public.restaurants (
  id uuid primary key references public.profiles(id) on delete cascade,
  name text,
  address text,
  phone text,
  description text
);

create table if not exists public.waiters (
  id uuid primary key references public.profiles(id) on delete cascade,
  full_name text,
  phone text,
  city text,
  bio text,
  experience text,
  preferred_areas text,
  photo_url text
);

create table if not exists public.instructions (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  title text not null,
  youtube_url text not null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.shifts (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  title text not null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  requirements text,
  status text not null default 'open' check (status in ('open', 'contracted', 'completed', 'cancelled')),
  hired_waiter_id uuid references public.waiters(id),
  created_at timestamptz not null default now(),
  check (end_at > start_at)
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  shift_id uuid not null references public.shifts(id) on delete cascade,
  waiter_id uuid not null references public.waiters(id) on delete cascade,
  status text not null default 'applied' check (status in ('applied', 'withdrawn', 'rejected', 'hired')),
  created_at timestamptz not null default now(),
  unique(shift_id, waiter_id)
);

create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  shift_id uuid not null references public.shifts(id) on delete cascade,
  rater_role text not null check (rater_role in ('restaurant', 'waiter')),
  rater_id uuid not null references public.profiles(id) on delete cascade,
  ratee_role text not null check (ratee_role in ('restaurant', 'waiter')),
  ratee_id uuid not null references public.profiles(id) on delete cascade,
  score int not null check (score between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique(shift_id, rater_id)
);

create table if not exists public.tips (
  id uuid primary key default gen_random_uuid(),
  waiter_id uuid not null references public.waiters(id) on delete cascade,
  amount numeric(10,2) not null check (amount > 0),
  message text,
  created_at timestamptz not null default now()
);

create index if not exists idx_shifts_restaurant on public.shifts(restaurant_id);
create index if not exists idx_shifts_status_start on public.shifts(status, start_at);
create index if not exists idx_apps_shift on public.applications(shift_id);
create index if not exists idx_apps_waiter on public.applications(waiter_id);
create index if not exists idx_tips_waiter on public.tips(waiter_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.restaurants enable row level security;
alter table public.waiters enable row level security;
alter table public.instructions enable row level security;
alter table public.shifts enable row level security;
alter table public.applications enable row level security;
alter table public.ratings enable row level security;
alter table public.tips enable row level security;

-- profiles
create policy "profiles_select_own" on public.profiles
  for select to authenticated
  using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert to authenticated
  with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- restaurants
create policy "restaurants_read_authenticated" on public.restaurants
  for select to authenticated
  using (true);

create policy "restaurants_insert_own" on public.restaurants
  for insert to authenticated
  with check (auth.uid() = id);

create policy "restaurants_update_own" on public.restaurants
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- waiters
create policy "waiters_read_public" on public.waiters
  for select
  using (true);

create policy "waiters_insert_own" on public.waiters
  for insert to authenticated
  with check (auth.uid() = id);

create policy "waiters_update_own" on public.waiters
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- instructions
create policy "instructions_read_authenticated" on public.instructions
  for select to authenticated
  using (true);

create policy "instructions_insert_own_restaurant" on public.instructions
  for insert to authenticated
  with check (restaurant_id = auth.uid());

create policy "instructions_update_own_restaurant" on public.instructions
  for update to authenticated
  using (restaurant_id = auth.uid())
  with check (restaurant_id = auth.uid());

create policy "instructions_delete_own_restaurant" on public.instructions
  for delete to authenticated
  using (restaurant_id = auth.uid());

-- shifts
create policy "shifts_restaurant_select_own" on public.shifts
  for select to authenticated
  using (restaurant_id = auth.uid());

create policy "shifts_waiter_select_open" on public.shifts
  for select to authenticated
  using (
    status = 'open'
    and exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role = 'waiter'
    )
  );

create policy "shifts_restaurant_insert_own" on public.shifts
  for insert to authenticated
  with check (restaurant_id = auth.uid());

create policy "shifts_restaurant_update_own" on public.shifts
  for update to authenticated
  using (restaurant_id = auth.uid())
  with check (restaurant_id = auth.uid());

create policy "shifts_restaurant_delete_own" on public.shifts
  for delete to authenticated
  using (restaurant_id = auth.uid());

-- applications
create policy "applications_waiter_read_own" on public.applications
  for select to authenticated
  using (waiter_id = auth.uid());

create policy "applications_restaurant_read_their_shifts" on public.applications
  for select to authenticated
  using (
    exists (
      select 1
      from public.shifts s
      where s.id = applications.shift_id
      and s.restaurant_id = auth.uid()
    )
  );

create policy "applications_waiter_insert_own" on public.applications
  for insert to authenticated
  with check (waiter_id = auth.uid());

create policy "applications_waiter_update_own" on public.applications
  for update to authenticated
  using (waiter_id = auth.uid())
  with check (waiter_id = auth.uid());

create policy "applications_restaurant_update_their_shifts" on public.applications
  for update to authenticated
  using (
    exists (
      select 1 from public.shifts s where s.id = applications.shift_id and s.restaurant_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.shifts s where s.id = applications.shift_id and s.restaurant_id = auth.uid()
    )
  );

-- ratings
create policy "ratings_read_authenticated" on public.ratings
  for select to authenticated
  using (true);

create policy "ratings_insert_if_completed_and_involved" on public.ratings
  for insert to authenticated
  with check (
    rater_id = auth.uid()
    and exists (
      select 1
      from public.shifts s
      where s.id = ratings.shift_id
      and s.status = 'completed'
      and (
        (rater_role = 'restaurant' and s.restaurant_id = auth.uid() and ratee_role = 'waiter' and ratee_id = s.hired_waiter_id)
        or
        (rater_role = 'waiter' and s.hired_waiter_id = auth.uid() and ratee_role = 'restaurant' and ratee_id = s.restaurant_id)
      )
    )
  );

-- tips
create policy "tips_public_insert" on public.tips
  for insert
  with check (amount > 0);

create policy "tips_waiter_select_own" on public.tips
  for select to authenticated
  using (waiter_id = auth.uid());
