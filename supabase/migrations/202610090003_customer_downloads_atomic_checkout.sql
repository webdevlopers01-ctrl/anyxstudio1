-- Customer downloads are only exposed after a paid/delivered order.
create or replace view public.product_items_public
with (security_invoker = false)
as select id, product_id, name, preview_path, sort_order, created_at from public.product_items;
grant select on public.product_items_public to anon, authenticated;

drop policy if exists "product_items_public_select" on public.product_items;
drop policy if exists "product_items_customer_download_select" on public.product_items;
create policy "product_items_customer_download_select" on public.product_items for select to authenticated
using (exists (select 1 from public.order_items oi join public.orders o on o.id = oi.order_id where oi.product_id = product_items.product_id and o.customer_id = (select auth.uid()) and o.status in ('paid', 'delivered')));

drop policy if exists "order_items_customer_select" on public.order_items;
create policy "order_items_customer_select" on public.order_items for select to authenticated
using (exists (select 1 from public.orders o where o.id = order_items.order_id and o.customer_id = (select auth.uid())));

create or replace function public.create_anyx_order_with_items(items jsonb)
returns uuid language plpgsql security invoker set search_path = public
as $$
declare new_order_id uuid; item jsonb; product_row record; qty integer; total numeric := 0; customer_name_value text;
begin
  if (select auth.uid()) is null then raise exception 'Sign in required'; end if;
  if items is null or jsonb_typeof(items) <> 'array' or jsonb_array_length(items) = 0 then raise exception 'Cart is empty'; end if;
  select coalesce(full_name, 'ANYX customer') into customer_name_value from public.profiles where id = (select auth.uid());
  insert into public.orders(customer_id, customer_name, customer_email, amount, status) values ((select auth.uid()), customer_name_value, (auth.jwt() ->> 'email'), 0, 'pending') returning id into new_order_id;
  for item in select * from jsonb_array_elements(items) loop
    qty := greatest(1, least(coalesce((item ->> 'quantity')::integer, 1), 100));
    select id, name, price into product_row from public.products where id = (item ->> 'product_id')::uuid and status = 'published';
    if product_row.id is null then raise exception 'A cart item is unavailable'; end if;
    insert into public.order_items(order_id, product_id, product_name, unit_price, quantity) values (new_order_id, product_row.id, product_row.name, product_row.price, qty);
    total := total + (product_row.price * qty);
  end loop;
  update public.orders set amount = total where id = new_order_id;
  return new_order_id;
end; $$;
revoke all on function public.create_anyx_order_with_items(jsonb) from anon;
grant execute on function public.create_anyx_order_with_items(jsonb) to authenticated;
