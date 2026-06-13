# Noctavian Studio

React source project with a Supabase-backed admin panel.

## Live Flow

1. GitHub stores the source code.
2. Vercel builds and deploys from GitHub automatically.
3. Supabase stores admin auth, editable content, and contact messages.
4. Wix only keeps the domain/DNS role.

## Vercel Settings

Project settings:

- Framework: Create React App
- Build Command: `cd frontend && yarn install --frozen-lockfile && yarn build`
- Output Directory: `frontend/build`
- Install Command: `cd frontend && yarn install --frozen-lockfile`

Environment variables:

- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`
- `ENABLE_HEALTH_CHECK=false`

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL Editor.
3. Create the admin user in Authentication > Users.
4. Copy the user's UUID.
5. Run the final `admin_profiles` insert at the bottom of `supabase/schema.sql` with the real UUID.

Admin panel: `/admin`

## Domain

Add `noctavian.com` and `www.noctavian.com` to the Vercel project. In Wix DNS, set the A/CNAME records Vercel gives you. Wix site builder is no longer part of the production flow.
