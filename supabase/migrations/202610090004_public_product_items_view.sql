-- Public catalog can show package item names without exposing private file paths.
create or replace view public.product_items_public
with (security_invoker = false)
as select id, product_id, name, preview_path, sort_order, created_at from public.product_items;
grant select on public.product_items_public to anon, authenticated;
