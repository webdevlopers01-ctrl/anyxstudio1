-- ANYX four-role access model. New profiles default to customer.

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles alter column role set default 'customer';
alter table public.profiles add constraint profiles_role_check
  check (role in ('owner', 'admin', 'artist', 'customer'));

create or replace function public.anyx_current_role()
returns text language sql stable security definer set search_path = public
as $$ select coalesce((select role from public.profiles where id = auth.uid()), 'customer'); $$;

create or replace function public.list_anyx_team_members()
returns table(id uuid, full_name text, role text)
language plpgsql security definer set search_path = public
as $$
begin
  if public.anyx_current_role() not in ('owner', 'admin') then
    raise exception 'Only owner or admin can view the team roster';
  end if;
  return query select p.id, coalesce(p.full_name, 'Team member'), p.role
    from public.profiles p
    order by case p.role when 'owner' then 0 when 'admin' then 1 when 'artist' then 2 else 3 end, p.full_name nulls last;
end;
$$;

create or replace function public.set_anyx_team_role(target_user_id uuid, next_role text)
returns void language plpgsql security definer set search_path = public
as $$
declare caller_role text := public.anyx_current_role();
declare target_role text;
begin
  if caller_role not in ('owner', 'admin') then raise exception 'Only owner or admin can manage team roles'; end if;
  if next_role not in ('admin', 'artist', 'customer') then raise exception 'Invalid team role'; end if;
  if target_user_id = auth.uid() then raise exception 'You cannot change your own role'; end if;
  select role into target_role from public.profiles where id = target_user_id;
  if target_role is null then raise exception 'Team member not found'; end if;
  if target_role = 'owner' then raise exception 'Owner role cannot be changed here'; end if;
  if caller_role = 'admin' and (target_role = 'admin' or next_role = 'admin') then raise exception 'Only the owner can manage admins'; end if;
  update public.profiles set role = next_role where id = target_user_id;
end;
$$;

create or replace function public.update_anyx_task_status(target_task_id uuid, next_status text)
returns void language plpgsql security invoker set search_path = public
as $$
begin
  if public.anyx_current_role() <> 'artist' then raise exception 'Only artists can update task progress'; end if;
  if next_status not in ('assigned', 'in_progress', 'submitted', 'revision', 'completed') then raise exception 'Invalid task status'; end if;
  update public.tasks set status = next_status where id = target_task_id and artist_id = auth.uid();
  if not found then raise exception 'Task not found or not assigned to you'; end if;
end;
$$;

revoke all on function public.anyx_current_role() from public;
revoke all on function public.list_anyx_team_members() from public;
revoke all on function public.set_anyx_team_role(uuid, text) from public;
revoke all on function public.update_anyx_task_status(uuid, text) from public;
grant execute on function public.anyx_current_role() to authenticated;
grant execute on function public.list_anyx_team_members() to authenticated;
grant execute on function public.set_anyx_team_role(uuid, text) to authenticated;
grant execute on function public.update_anyx_task_status(uuid, text) to authenticated;

drop policy if exists "users can view own profile" on public.profiles;
drop policy if exists "owner and admins view profiles" on public.profiles;
create policy "users can view own profile" on public.profiles for select to authenticated
using (id = auth.uid());
create policy "owner and admins view profiles" on public.profiles for select to authenticated
using (public.anyx_current_role() in ('owner', 'admin'));

drop policy if exists "owner and admins manage clients" on public.clients;
drop policy if exists "owner and admins manage projects" on public.projects;
drop policy if exists "owner and admins manage tasks" on public.tasks;
drop policy if exists "owner and admins manage products" on public.products;
drop policy if exists "artist can view assigned tasks" on public.tasks;
drop policy if exists "artist can update assigned tasks" on public.tasks;

create policy "owner and admins manage clients" on public.clients for all to authenticated
using (public.anyx_current_role() in ('owner', 'admin')) with check (public.anyx_current_role() in ('owner', 'admin'));
create policy "owner and admins manage projects" on public.projects for all to authenticated
using (public.anyx_current_role() in ('owner', 'admin')) with check (public.anyx_current_role() in ('owner', 'admin'));
create policy "owner and admins manage tasks" on public.tasks for all to authenticated
using (public.anyx_current_role() in ('owner', 'admin')) with check (public.anyx_current_role() in ('owner', 'admin'));
create policy "artists view assigned tasks" on public.tasks for select to authenticated
using (artist_id = auth.uid() and public.anyx_current_role() = 'artist');
create policy "artists update assigned tasks" on public.tasks for update to authenticated
using (artist_id = auth.uid() and public.anyx_current_role() = 'artist')
with check (artist_id = auth.uid() and public.anyx_current_role() = 'artist');
create policy "owner and admins manage products" on public.products for all to authenticated
using (public.anyx_current_role() in ('owner', 'admin')) with check (public.anyx_current_role() in ('owner', 'admin'));

drop policy if exists "owner and admins view project requests" on public.project_requests;
drop policy if exists "owner and admins update project requests" on public.project_requests;
create policy "owner and admins view project requests" on public.project_requests for select to authenticated
using (public.anyx_current_role() in ('owner', 'admin'));
create policy "owner and admins update project requests" on public.project_requests for update to authenticated
using (public.anyx_current_role() in ('owner', 'admin')) with check (public.anyx_current_role() in ('owner', 'admin'));
