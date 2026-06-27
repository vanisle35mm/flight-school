create schema if not exists private;

create table if not exists public.groundschool_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null,
  login_name text not null unique,
  role text not null check (role in ('admin', 'student')),
  requires_password_reset boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.groundschool_user_data (
  user_id uuid primary key references public.groundschool_profiles(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.groundschool_profiles enable row level security;
alter table public.groundschool_user_data enable row level security;

create or replace function private.is_groundschool_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.groundschool_profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

revoke all on function private.is_groundschool_admin() from public;
grant usage on schema private to authenticated;
grant execute on function private.is_groundschool_admin() to authenticated;

drop policy if exists "Users read own profile and admins read all" on public.groundschool_profiles;
drop policy if exists "Admins update profiles" on public.groundschool_profiles;
drop policy if exists "Users read own data and admins read all" on public.groundschool_user_data;
drop policy if exists "Users insert own data and admins insert all" on public.groundschool_user_data;
drop policy if exists "Users update own data and admins update all" on public.groundschool_user_data;
drop policy if exists "Admins delete user data" on public.groundschool_user_data;

create policy "Users read own profile and admins read all"
on public.groundschool_profiles
for select
to authenticated
using ((select auth.uid()) = id or (select private.is_groundschool_admin()));

create policy "Admins update profiles"
on public.groundschool_profiles
for update
to authenticated
using ((select private.is_groundschool_admin()))
with check ((select private.is_groundschool_admin()));

create policy "Users read own data and admins read all"
on public.groundschool_user_data
for select
to authenticated
using ((select auth.uid()) = user_id or (select private.is_groundschool_admin()));

create policy "Users insert own data and admins insert all"
on public.groundschool_user_data
for insert
to authenticated
with check ((select auth.uid()) = user_id or (select private.is_groundschool_admin()));

create policy "Users update own data and admins update all"
on public.groundschool_user_data
for update
to authenticated
using ((select auth.uid()) = user_id or (select private.is_groundschool_admin()))
with check ((select auth.uid()) = user_id or (select private.is_groundschool_admin()));

create policy "Admins delete user data"
on public.groundschool_user_data
for delete
to authenticated
using ((select private.is_groundschool_admin()));

grant select on public.groundschool_profiles to authenticated;
grant update (first_name, login_name, requires_password_reset, updated_at) on public.groundschool_profiles to authenticated;
grant select, insert, update, delete on public.groundschool_user_data to authenticated;

revoke all on public.groundschool_profiles from anon;
revoke all on public.groundschool_user_data from anon;

create or replace function public.set_groundschool_secure_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists groundschool_profiles_updated_at on public.groundschool_profiles;
create trigger groundschool_profiles_updated_at
before update on public.groundschool_profiles
for each row execute function public.set_groundschool_secure_updated_at();

drop trigger if exists groundschool_user_data_updated_at on public.groundschool_user_data;
create trigger groundschool_user_data_updated_at
before update on public.groundschool_user_data
for each row execute function public.set_groundschool_secure_updated_at();

-- The legacy shared record remains available to the server for migration only.
drop policy if exists "Allow public test reads" on public.groundschool_app_state;
drop policy if exists "Allow public test inserts" on public.groundschool_app_state;
drop policy if exists "Allow public test updates" on public.groundschool_app_state;
revoke all on public.groundschool_app_state from anon;
