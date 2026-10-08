-- Cover customer/product foreign keys used by customer dashboards and wishlist joins.
create index if not exists project_requests_customer_id_idx on public.project_requests(customer_id);
create index if not exists wishlists_product_id_idx on public.wishlists(product_id);
