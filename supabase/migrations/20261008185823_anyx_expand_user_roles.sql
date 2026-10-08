-- Mirror of the live client-studio migration: anyx_expand_user_roles.
-- The live project uses public.user_role; this file keeps that schema change in Git.

do $$ begin
  create type public.user_role as enum ('admin', 'artist', 'owner', 'customer');
exception when duplicate_object then null;
end $$;

alter table public.profiles add column if not exists active boolean not null default true;
alter table public.profiles add column if not exists updated_at timestamptz not null default now();
alter table public.profiles alter column role set default 'customer';

alter table public.products add column if not exists product_type text not null default 'product';
alter table public.products drop constraint if exists products_product_type_check;
alter table public.products add constraint products_product_type_check check (product_type in ('product', 'package'));

alter table public.project_requests add column if not exists customer_id uuid references public.profiles(id);
alter table public.orders add column if not exists customer_id uuid references public.profiles(id);
