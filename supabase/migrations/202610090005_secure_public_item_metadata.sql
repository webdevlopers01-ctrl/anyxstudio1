-- Keep catalog metadata public while private file paths remain customer-only.
drop view if exists public.product_items_public;
create table if not exists public.product_item_catalog (
  id uuid primary key,
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  preview_path text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.product_item_catalog enable row level security;
drop policy if exists "product_item_catalog_public_select" on public.product_item_catalog;
drop policy if exists "product_item_catalog_admin_all" on public.product_item_catalog;
create policy "product_item_catalog_public_select" on public.product_item_catalog for select to anon, authenticated
using (exists (select 1 from public.products p where p.id = product_item_catalog.product_id and p.status = 'published'));
create policy "product_item_catalog_admin_all" on public.product_item_catalog for all to authenticated using (public.is_admin()) with check (public.is_admin());
insert into public.product_item_catalog(id,product_id,name,preview_path,sort_order,created_at)
select id,product_id,name,preview_path,sort_order,created_at from public.product_items on conflict (id) do update set name=excluded.name,preview_path=excluded.preview_path,sort_order=excluded.sort_order;
create or replace function public.sync_product_item_catalog()
returns trigger language plpgsql security invoker set search_path = public
as $$ begin
  if tg_op = 'DELETE' then delete from public.product_item_catalog where id = old.id; return old; end if;
  insert into public.product_item_catalog(id,product_id,name,preview_path,sort_order,created_at) values (new.id,new.product_id,new.name,new.preview_path,new.sort_order,new.created_at)
  on conflict (id) do update set product_id=excluded.product_id,name=excluded.name,preview_path=excluded.preview_path,sort_order=excluded.sort_order;
  return new;
end; $$;
drop trigger if exists sync_product_item_catalog on public.product_items;
create trigger sync_product_item_catalog after insert or update or delete on public.product_items for each row execute function public.sync_product_item_catalog();
create or replace view public.product_items_public with (security_invoker = true)
as select id,product_id,name,preview_path,sort_order,created_at from public.product_item_catalog;
grant select on public.product_items_public to anon, authenticated;
