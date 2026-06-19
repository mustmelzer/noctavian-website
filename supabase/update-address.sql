insert into public.site_settings (key, value) values
('address', 'Yeni Mh. 500. Sk No:11 16940 Mudanya/BURSA'),
('addressTr', 'Yeni Mh. 500. Sk No:11 16940 Mudanya/BURSA')
on conflict (key) do update set value = excluded.value, updated_at = now();
