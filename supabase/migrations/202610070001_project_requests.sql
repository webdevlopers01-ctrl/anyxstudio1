-- Customer-facing project request queue for ANYX Studio.
-- Apply in Supabase SQL Editor before deploying the request form.

create table if not exists public.project_requests (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null check (char_length(customer_name) between 2 and 120),
  email text,
  service text not null,
  game text,
  deadline date,
  requirements text not null check (char_length(requirements) between 10 and 5000),
  status text not null default 'requested' check (status in ('requested', 'reviewing', 'assigned', 'in_progress', 'review', 'revision', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.project_requests enable row level security;

create policy "public can submit project requests"
on public.project_requests for insert
to anon, authenticated
with check (true);

create policy "admins can view project requests"
on public.project_requests for select
to authenticated
using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "admins can update project requests"
on public.project_requests for update
to authenticated
using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create or replace function public.set_project_request_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_project_request_updated_at on public.project_requests;
create trigger set_project_request_updated_at
before update on public.project_requests
for each row execute function public.set_project_request_updated_at();
