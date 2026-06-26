create table if not exists public.groundschool_app_state (
  id text primary key default 'primary',
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.groundschool_app_state enable row level security;

drop policy if exists "Allow public test reads" on public.groundschool_app_state;
drop policy if exists "Allow public test inserts" on public.groundschool_app_state;
drop policy if exists "Allow public test updates" on public.groundschool_app_state;

create policy "Allow public test reads"
on public.groundschool_app_state
for select
using (true);

create policy "Allow public test inserts"
on public.groundschool_app_state
for insert
with check (id = 'primary');

create policy "Allow public test updates"
on public.groundschool_app_state
for update
using (id = 'primary')
with check (id = 'primary');

create or replace function public.set_groundschool_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists groundschool_app_state_updated_at on public.groundschool_app_state;

create trigger groundschool_app_state_updated_at
before update on public.groundschool_app_state
for each row
execute function public.set_groundschool_updated_at();
