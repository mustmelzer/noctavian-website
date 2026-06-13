-- Run this after the initial setup if seed data was inserted more than once.
-- It keeps the oldest row for each title and removes duplicate copies.

delete from public.site_games
where id in (
  select id
  from (
    select
      id,
      row_number() over (
        partition by lower(title)
        order by sort_order asc, created_at asc, id asc
      ) as rn
    from public.site_games
  ) ranked
  where rn > 1
);

delete from public.site_projects
where id in (
  select id
  from (
    select
      id,
      row_number() over (
        partition by lower(title)
        order by sort_order asc, created_at asc, id asc
      ) as rn
    from public.site_projects
  ) ranked
  where rn > 1
);

create unique index if not exists site_games_unique_title on public.site_games (lower(title));
create unique index if not exists site_projects_unique_title on public.site_projects (lower(title));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-images',
  'site-images',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read site images" on storage.objects;
create policy "Public can read site images" on storage.objects
for select to anon, authenticated
using (bucket_id = 'site-images');

drop policy if exists "Admins can upload site images" on storage.objects;
create policy "Admins can upload site images" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'site-images'
  and exists (select 1 from public.admin_profiles where user_id = auth.uid())
);

drop policy if exists "Admins can update site images" on storage.objects;
create policy "Admins can update site images" on storage.objects
for update to authenticated
using (
  bucket_id = 'site-images'
  and exists (select 1 from public.admin_profiles where user_id = auth.uid())
)
with check (
  bucket_id = 'site-images'
  and exists (select 1 from public.admin_profiles where user_id = auth.uid())
);

drop policy if exists "Public can read visible games" on public.site_games;
create policy "Public can read visible games" on public.site_games
for select to anon, authenticated
using (is_visible = true);

drop policy if exists "Public can read visible projects" on public.site_projects;
create policy "Public can read visible projects" on public.site_projects
for select to anon, authenticated
using (is_visible = true);
