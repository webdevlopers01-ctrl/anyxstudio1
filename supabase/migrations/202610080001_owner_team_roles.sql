-- Owner-managed team hierarchy for ANYX Studio.
-- Existing staff remain artists until the owner promotes them.

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles alter column role set default 'artist';
alter table public.profiles add constraint profiles_role_check
  check (role in ('owner', 'admin', 'artist'));

create or replace function public.is_anyx_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'owner'
  );
$$;

create or replace function public.list_anyx_team_members()
returns table(id uuid, full_name text, role text)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_anyx_owner() then
    raise exception 'Only the owner can view the team roster';
  end if;

  return query
    select p.id, coalesce(p.full_name, 'Team member'), p.role
    from public.profiles p
    order by case p.role when 'owner' then 0 when 'admin' then 1 else 2 end, p.full_name nulls last;
end;
$$;

create or replace function public.set_anyx_team_role(target_user_id uuid, next_role text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_anyx_owner() then
    raise exception 'Only the owner can manage team roles';
  end if;
  if next_role not in ('admin', 'artist') then
    raise exception 'Only admin and artist roles can be assigned here';
  end if;
  if target_user_id = auth.uid() then
    raise exception 'Owner role cannot be changed here';
  end if;

  update public.profiles set role = next_role where id = target_user_id;
end;
$$;

grant execute on function public.list_anyx_team_members() to authenticated;
grant execute on function public.set_anyx_team_role(uuid, text) to authenticated;

-- Give the owner the same studio-data access currently granted to admins.
create policy "owner and admins manage clients" on public.clients for all to authenticated
using (exists (select 1 from public.profiles where id = auth.uid() and role in ('owner', 'admin')))
with check (exists (select 1 from public.profiles where id = auth.uid() and role in ('owner', 'admin')));

create policy "owner and admins manage projects" on public.projects for all to authenticated
using (exists (select 1 from public.profiles where id = auth.uid() and role in ('owner', 'admin')))
with check (exists (select 1 from public.profiles where id = auth.uid() and role in ('owner', 'admin')));

create policy "owner and admins manage tasks" on public.tasks for all to authenticated
using (exists (select 1 from public.profiles where id = auth.uid() and role in ('owner', 'admin')))
with check (exists (select 1 from public.profiles where id = auth.uid() and role in ('owner', 'admin')));

create policy "owner and admins manage products" on public.products for all to authenticated
using (exists (select 1 from public.profiles where id = auth.uid() and role in ('owner', 'admin')))
with check (exists (select 1 from public.profiles where id = auth.uid() and role in ('owner', 'admin')));

drop policy if exists "admins can view project requests" on public.project_requests;
drop policy if exists "admins can update project requests" on public.project_requests;
create policy "owner and admins view project requests" on public.project_requests for select to authenticated
using (exists (select 1 from public.profiles where id = auth.uid() and role in ('owner', 'admin')));
create policy "owner and admins update project requests" on public.project_requests for update to authenticated
using (exists (select 1 from public.profiles where id = auth.uid() and role in ('owner', 'admin')))
with check (exists (select 1 from public.profiles where id = auth.uid() and role in ('owner', 'admin')));
