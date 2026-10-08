# Client Studio — Studio Portfolio & Creative Management Platform

## V1
- Public studio website: home, about, services, portfolio, contact
- Digital asset shop and product detail pages
- WhatsApp-first purchase flow; no payment gateway
- Google OAuth login with four roles: Owner, Admin, Artist and Customer
- Owner: manages admins/artists and can launch products and packages
- Admin: manages artists, assigns work and can launch products and packages
- Artist: sees only assigned sanitized briefs and updates progress
- Customer: default role for normal users, with customer workspace access
- Supabase PostgreSQL + Storage + RLS
- Client contact data is not exposed to artist queries

## Environment
Copy .env.example to .env.local. Use only the Supabase publishable key in browser-facing variables. Never expose a secret/service-role key.

## Google OAuth
Enable Google in Supabase Authentication > Providers. Create a Google OAuth Web application and use the callback URL shown by Supabase. Add the app origin and /auth/callback to the Supabase Auth redirect allow-list.

## First owner
New Google users are created as customers by default. After the owner's first login, apply the role migrations and promote the intended owner once in Supabase SQL Editor:

update public.profiles p
set role='owner'
from auth.users u
where p.id=u.id and u.email='OWNER_GOOGLE_EMAIL';

This is deliberately manual so arbitrary Google users cannot self-promote.

## Run
npm install
npm run dev
