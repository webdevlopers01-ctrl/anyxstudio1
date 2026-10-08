-- Keep client-callable RPCs behind RLS instead of SECURITY DEFINER.
-- This mirrors the live client-studio migration anyx_harden_client_rpcs.

create or replace function public.list_anyx_team_members()
returns table(id uuid, full_name text, role public.user_role, active boolean)
language sql stable security invoker set search_path = public
as $$
  select p.id, p.full_name, p.role, p.active
  from public.profiles p
  where public.is_admin()
  order by case p.role when 'owner'::public.user_role then 0 when 'admin'::public.user_role then 1 when 'artist'::public.user_role then 2 else 3 end, p.created_at;
$$;

create or replace function public.set_anyx_team_role(target_user_id uuid, next_role public.user_role)
returns public.user_role
language plpgsql security invoker set search_path = public
as $$
declare caller_role public.user_role; target_role public.user_role;
begin
  select role into caller_role from public.profiles where id = (select auth.uid()) and active = true;
  if caller_role not in ('owner'::public.user_role, 'admin'::public.user_role) then raise exception 'Only the owner or an admin can manage team roles'; end if;
  if target_user_id = (select auth.uid()) then raise exception 'You cannot change your own role'; end if;
  select role into target_role from public.profiles where id = target_user_id;
  if target_role is null then raise exception 'Target profile not found'; end if;
  if target_role = 'owner'::public.user_role then raise exception 'The owner cannot be changed from the workspace'; end if;
  if next_role = 'owner'::public.user_role then raise exception 'Owner role can only be assigned through a trusted database operation'; end if;
  if caller_role = 'admin'::public.user_role and next_role not in ('artist'::public.user_role, 'customer'::public.user_role) then raise exception 'Admins can only manage artists and customers'; end if;
  update public.profiles set role = next_role, active = true where id = target_user_id;
  return next_role;
end;
$$;

create or replace function public.update_anyx_task_status(target_task_id uuid, next_status public.task_status)
returns public.task_status
language plpgsql security invoker set search_path = public
as $$
declare caller_role public.user_role; current_status public.task_status; task_artist uuid;
begin
  select role into caller_role from public.profiles where id = (select auth.uid()) and active = true;
  select t.status, t.artist_id into current_status, task_artist from public.tasks t where t.id = target_task_id for update;
  if current_status is null then raise exception 'Task not found'; end if;
  if caller_role in ('owner'::public.user_role, 'admin'::public.user_role) then
    update public.tasks set status = next_status where id = target_task_id;
  elsif caller_role = 'artist'::public.user_role and task_artist = (select auth.uid()) then
    if not ((current_status = 'assigned'::public.task_status and next_status = 'in_progress'::public.task_status) or (current_status = 'in_progress'::public.task_status and next_status = 'submitted'::public.task_status) or (current_status = 'revision'::public.task_status and next_status = 'in_progress'::public.task_status)) then raise exception 'Invalid artist task status transition'; end if;
    update public.tasks set status = next_status where id = target_task_id;
  else raise exception 'You do not have access to this task'; end if;
  return next_status;
end;
$$;

revoke all on function public.list_anyx_team_members() from anon;
revoke all on function public.set_anyx_team_role(uuid, public.user_role) from anon;
revoke all on function public.update_anyx_task_status(uuid, public.task_status) from anon;
grant execute on function public.list_anyx_team_members() to authenticated;
grant execute on function public.set_anyx_team_role(uuid, public.user_role) to authenticated;
grant execute on function public.update_anyx_task_status(uuid, public.task_status) to authenticated;
