-- Mirror of the live client-studio migration: anyx_four_role_customer_workspace.

create table if not exists public.wishlists (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (customer_id, product_id)
);
alter table public.wishlists enable row level security;

drop policy if exists "wishlists_select_own" on public.wishlists;
drop policy if exists "wishlists_insert_own" on public.wishlists;
drop policy if exists "wishlists_delete_own" on public.wishlists;
create policy "wishlists_select_own" on public.wishlists for select to authenticated using (customer_id = (select auth.uid()));
create policy "wishlists_insert_own" on public.wishlists for insert to authenticated
with check (customer_id = (select auth.uid()) and exists (select 1 from public.products p where p.id = product_id and p.status = 'published'));
create policy "wishlists_delete_own" on public.wishlists for delete to authenticated using (customer_id = (select auth.uid()));

drop policy if exists "orders_customer_select" on public.orders;
create policy "orders_customer_select" on public.orders for select to authenticated using (customer_id = (select auth.uid()));

drop policy if exists "project_requests_customer_select" on public.project_requests;
create policy "project_requests_customer_select" on public.project_requests for select to authenticated using (customer_id = (select auth.uid()));
