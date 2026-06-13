-- Noctavian Studio Supabase setup
-- 1. Run this in Supabase SQL Editor.
-- 2. Create your admin Auth user.
-- 3. Add that user's UUID to admin_profiles near the bottom of this file.

create extension if not exists pgcrypto;

create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.site_games (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_tr text not null,
  description text not null,
  description_tr text not null,
  category text not null default 'mobile',
  tag text not null default 'Mobile Game',
  tag_tr text not null default 'Mobil Oyun',
  status text not null default 'coming-soon',
  image text not null,
  game_url text,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_tr text not null,
  description text not null,
  description_tr text not null,
  category text not null default 'mobile',
  tag text not null default 'Mobile Game',
  tag_tr text not null default 'Mobil Oyun',
  status text not null default 'coming-soon',
  image text not null,
  game_url text,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_site_games_updated_at on public.site_games;
create trigger set_site_games_updated_at
before update on public.site_games
for each row execute function public.set_updated_at();

drop trigger if exists set_site_projects_updated_at on public.site_projects;
create trigger set_site_projects_updated_at
before update on public.site_projects
for each row execute function public.set_updated_at();

alter table public.admin_profiles enable row level security;
alter table public.site_games enable row level security;
alter table public.site_projects enable row level security;
alter table public.site_settings enable row level security;
alter table public.contact_messages enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.site_games to anon, authenticated;
grant select on public.site_projects to anon, authenticated;
grant select on public.site_settings to anon, authenticated;
grant insert on public.contact_messages to anon, authenticated;
grant select, insert, update, delete on public.site_games to authenticated;
grant select, insert, update, delete on public.site_projects to authenticated;
grant select, insert, update, delete on public.site_settings to authenticated;
grant select, update on public.contact_messages to authenticated;
grant select on public.admin_profiles to authenticated;

drop policy if exists "Admins can read admin profiles" on public.admin_profiles;
create policy "Admins can read admin profiles" on public.admin_profiles
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "Public can read visible games" on public.site_games;
create policy "Public can read visible games" on public.site_games
for select to anon, authenticated
using (is_visible = true or exists (select 1 from public.admin_profiles where user_id = auth.uid()));

drop policy if exists "Admins can manage games" on public.site_games;
create policy "Admins can manage games" on public.site_games
for all to authenticated
using (exists (select 1 from public.admin_profiles where user_id = auth.uid()))
with check (exists (select 1 from public.admin_profiles where user_id = auth.uid()));

drop policy if exists "Public can read visible projects" on public.site_projects;
create policy "Public can read visible projects" on public.site_projects
for select to anon, authenticated
using (is_visible = true or exists (select 1 from public.admin_profiles where user_id = auth.uid()));

drop policy if exists "Admins can manage projects" on public.site_projects;
create policy "Admins can manage projects" on public.site_projects
for all to authenticated
using (exists (select 1 from public.admin_profiles where user_id = auth.uid()))
with check (exists (select 1 from public.admin_profiles where user_id = auth.uid()));

drop policy if exists "Public can read settings" on public.site_settings;
create policy "Public can read settings" on public.site_settings
for select to anon, authenticated
using (true);

drop policy if exists "Admins can manage settings" on public.site_settings;
create policy "Admins can manage settings" on public.site_settings
for all to authenticated
using (exists (select 1 from public.admin_profiles where user_id = auth.uid()))
with check (exists (select 1 from public.admin_profiles where user_id = auth.uid()));

drop policy if exists "Anyone can submit contact messages" on public.contact_messages;
create policy "Anyone can submit contact messages" on public.contact_messages
for insert to anon, authenticated
with check (true);

drop policy if exists "Admins can read contact messages" on public.contact_messages;
create policy "Admins can read contact messages" on public.contact_messages
for select to authenticated
using (exists (select 1 from public.admin_profiles where user_id = auth.uid()));

insert into public.site_games (title, title_tr, description, description_tr, category, tag, tag_tr, status, image, game_url, sort_order, is_visible) values
('Ecopak X', 'Ecopak X', 'An industrial simulation game centered on controlling a solar panel cleaning robot. Players manage efficiency, movement, and environmental challenges to maximize cleaning performance. Developed for educational and promotional purposes.', 'Güneş paneli temizleme robotunu kontrol etmeye odaklanan endüstriyel simülasyon oyunu. Oyuncular verimlilik, hareket ve çevresel zorlukları yöneterek temizlik performansını maksimize eder. Eğitim ve tanıtım amaçlı geliştirilmiştir.', 'mobile', 'Mobile Game', 'Mobil Oyun', 'coming-soon', 'https://customer-assets.emergentagent.com/job_design-clone-55/artifacts/q0ghaouq_ECOPAK%20X.png', null, 1, true),
('Blitz Brigade', 'Blitz Brigade', 'A cooperative board game set in World War II London. Players take on the role of a firefighting brigade responding to air raids, managing crises through teamwork, tactical planning, and resource coordination.', 'İkinci Dünya Savaşı Londra''sında geçen kooperatif masa oyunu. Oyuncular hava saldırılarına müdahale eden itfaiye tugayı rolünü üstlenir, takım çalışması, taktik planlama ve kaynak koordinasyonu ile krizleri yönetir.', 'board', 'Board Game', 'Masa Oyunu', 'coming-soon', 'https://customer-assets.emergentagent.com/job_design-clone-55/artifacts/j68irtq1_BLITZ%20BRIGADE.png', null, 2, true),
('Gooooal!!!', 'Gooooal!!!', 'A two-player football-themed board game combining dice rolls, card mechanics, and positional strategy. Fast matches, tactical decisions, and head-to-head competition drive the experience.', 'Zar atışları, kart mekanikleri ve pozisyon stratejisini birleştiren iki kişilik futbol temalı masa oyunu. Hızlı maçlar, taktik kararlar ve kafa kafaya rekabet deneyimi sunar.', 'board', 'Board Game', 'Masa Oyunu', 'active', 'https://customer-assets.emergentagent.com/job_design-clone-55/artifacts/qa1bnd86_GOOOOAL.png', 'https://boardgamegeek.com/boardgame/434510/gooooal', 3, true),
('Axis All Together', 'Axis All Together', 'A cooperative World War II aerial combat PC game where players work together as a squadron. Coordinate attacks, manage resources, and complete missions through strategic teamwork.', 'Oyuncuların bir filo olarak birlikte çalıştığı kooperatif İkinci Dünya Savaşı hava muharebesi PC oyunu. Saldırıları koordine edin, kaynakları yönetin ve stratejik takım çalışmasıyla görevleri tamamlayın.', 'pc', 'PC Game', 'PC Oyunu', 'coming-soon', 'https://customer-assets.emergentagent.com/job_design-clone-55/artifacts/hemtqxzp_AXIS%20ALL%20TOGETHER.png', null, 4, true),
('Axis Alone', 'Axis Alone', 'A solo variant World War II flight simulation PC game. Take control of a single pilot, manage your aircraft, and survive intense aerial combat scenarios on your own.', 'Solo oynanabilen İkinci Dünya Savaşı uçuş simülasyonu PC oyunu. Tek bir pilotu kontrol edin, uçağınızı yönetin ve yoğun hava muharebesi senaryolarında hayatta kalın.', 'pc', 'PC Game', 'PC Oyunu', 'coming-soon', 'https://customer-assets.emergentagent.com/job_design-clone-55/artifacts/v1kop8n5_AXIS%20ALONE.png', null, 5, true),
('Museum of Curses', 'Museum of Curses', 'A dark, gothic-themed slot game concept built around cursed artifacts and occult symbolism. Strong visual identity and atmospheric worldbuilding define its tone and presentation.', 'Lanetli eserler ve okült sembolizm etrafında inşa edilmiş karanlık, gotik temalı slot oyunu konsepti. Güçlü görsel kimlik ve atmosferik dünya inşası tonunu ve sunumunu tanımlar.', 'chance', 'Game of Chance', 'Şans Oyunu', 'coming-soon', 'https://customer-assets.emergentagent.com/job_design-clone-55/artifacts/6bl3w29o_MUSEUM%20of%20CURSES.png', null, 6, true),
('Harf It', 'Harf It', 'A fun and educational word puzzle mobile game that challenges players to form words from given letters. Perfect for all ages to improve vocabulary and have fun.', 'Oyuncuları verilen harflerden kelime oluşturmaya davet eden eğlenceli ve eğitici bir kelime bulmaca mobil oyunu. Kelime dağarcığını geliştirmek ve eğlenmek için her yaşa uygun.', 'mobile', 'Mobile Game', 'Mobil Oyun', 'coming-soon', 'https://customer-assets.emergentagent.com/job_design-clone-55/artifacts/ziaiuzta_Harf%20It.png', null, 7, true),
('U-Diver', 'U-Diver', 'An underwater adventure mobile game where players explore the depths of the ocean, discover treasures, and encounter marine life. Dive deep and uncover the mysteries of the sea.', 'Oyuncuların okyanusun derinliklerini keşfettiği, hazineler bulduğu ve deniz yaşamıyla karşılaştığı su altı macera mobil oyunu. Derinlere dalın ve denizin gizemlerini ortaya çıkarın.', 'mobile', 'Mobile Game', 'Mobil Oyun', 'coming-soon', 'https://customer-assets.emergentagent.com/job_design-clone-55/artifacts/aqa3g1vt_U-Diver.png', null, 8, true),
('Makara', 'Makara', 'Makara is a fast-paced word game where players create new words using the last letter of the previous one. Designed to test vocabulary, speed, and creativity, the game encourages quick thinking and clever word choices. Easy to learn and highly competitive, Makara keeps every round lively and engaging.', 'Makara, bir önceki kelimenin son harfiyle yeni kelimeler üretmeye dayalı, hızlı tempolu bir kelime oyunudur. Kelime bilgisi, hız ve yaratıcılığı ön plana çıkarır. Kolay öğrenilen kuralları ve rekabetçi yapısıyla her turu dinamik kılar.', 'board', 'Board Game', 'Masa Oyunu', 'active', 'https://customer-assets.emergentagent.com/job_design-clone-55/artifacts/ukm0t8bf_MAKARA.png', 'https://boardgamegeek.com/boardgame/411980/makara', 9, true),
('Makara 90''lar', 'Makara 90''lar', 'Makara 90''lar is a nostalgic variation of the original Makara game, inspired by 1990s pop culture. By introducing era-themed words and references, it adds a playful and memory-driven layer to the classic word-chaining mechanics, blending humor with language skills.', 'Makara 90''lar, orijinal Makara oyununun 1990''lar pop kültüründen ilham alan nostaljik bir versiyonudur. Döneme özgü kelimeler ve göndermelerle, klasik kelime zinciri mekaniğine eğlenceli ve hatıra odaklı bir katman ekler.', 'board', 'Board Game', 'Masa Oyunu', 'active', 'https://customer-assets.emergentagent.com/job_design-clone-55/artifacts/vhwcn7v4_MAKARA%2090.png', 'https://boardgamegeek.com/boardgame/438687/makara-90lar', 10, true),
('Wombat Kombat', 'Wombat Kombat', 'Wombat Kombat is a lighthearted, family-friendly board game where animal characters clash in chaotic and humorous battles. With fast turns and simple mechanics, the game focuses on playful competition, accessibility, and strong visual appeal.', 'Wombat Kombat, hayvan karakterlerin kaotik ve eğlenceli mücadelelere girdiği, aile dostu bir masaüstü oyunudur. Basit mekanikleri, hızlı turları ve güçlü görsel diliyle eğlenceyi ön plana çıkarır.', 'board', 'Board Game', 'Masa Oyunu', 'active', 'https://customer-assets.emergentagent.com/job_design-clone-55/artifacts/clopngs6_WOMBAT%20KOMBAT.png', 'https://boardgamegeek.com/boardgame/339754/wombat-kombat', 11, true),
('Lycka Bingo', 'Lycka Bingo', 'Bingo is a classic game of chance where players mark numbers on their cards as they are randomly drawn. The goal is to complete specific number patterns before other players. Simple rules, anticipation, and social interaction are at the heart of the experience.', 'Bingo, rastgele çekilen sayıları kart üzerinde işaretlemeye dayalı klasik bir şans oyunudur. Amaç, belirli sayı desenlerini diğer oyunculardan önce tamamlamaktır. Basit kuralları, heyecan duygusu ve sosyal yapısıyla öne çıkar.', 'chance', 'Game of Chance', 'Şans Oyunu', 'coming-soon', 'https://customer-assets.emergentagent.com/job_design-clone-55/artifacts/0sm30hsj_BINGO.png', null, 12, true)
on conflict do nothing;

insert into public.site_projects (title, title_tr, description, description_tr, category, tag, tag_tr, status, image, game_url, sort_order, is_visible) values
('Dungeon Match', 'Dungeon Match', 'Dungeon Match is a competitive, turn-based puzzle combat game built for mobile. Players face each other in tactical duels where match-based moves directly translate into attacks, defense, and resource management.', 'Dungeon Match, mobil platformlar için geliştirilen, rekabetçi ve sıra tabanlı bir puzzle savaş oyunudur. Oyuncular, eşleştirme hamlelerinin doğrudan saldırı, savunma ve kaynak yönetimine dönüştüğü taktiksel düellolarda karşı karşıya gelir.', 'mobile', 'Mobile Game', 'Mobil Oyun', 'coming-soon', 'https://customer-assets.emergentagent.com/job_design-clone-55/artifacts/22pcfsao_DUNGEON%20MATCH.png', null, 1, true),
('Storm Warfare', 'Storm Warfare', 'Storm Warfare is a turn-based digital card game built for PC, centered around tactical decision-making and controlled battlefield momentum. Players construct decks, deploy units, and trigger abilities to outmaneuver their opponent across structured combat encounters.', 'Storm Warfare, PC platformu için geliştirilen, sıra tabanlı ve taktik odaklı bir dijital kart oyunudur. Oyuncular, destelerini oluşturur, birimlerini sahaya sürer ve yetenekleri doğru zamanda kullanarak rakiplerini alt etmeye çalışır.', 'pc', 'PC Game', 'PC Oyunu', 'active', 'https://customer-assets.emergentagent.com/job_design-clone-55/artifacts/j1j2gb8q_STORM%20WARFARE.png', 'https://stormwarfare.com', 2, true)
on conflict do nothing;

insert into public.site_settings (key, value) values
('email', 'info@noctavian.com'),
('phone', '+90 543 285 57 02'),
('address', 'Çeltikköy, 3. Sevim Sk. No:15/1, 16000 Osmangazi Bursa, Turkey'),
('addressTr', 'Çeltikköy, 3. Sevim Sk. No:15/1, 16000 Osmangazi Bursa, Türkiye'),
('instagram', 'https://www.instagram.com/noctavian.studio/'),
('twitter', 'https://x.com/noctavian_stud'),
('linkedin', 'https://www.linkedin.com/company/noctavian-studio/')
on conflict (key) do update set value = excluded.value, updated_at = now();

-- After creating your Supabase Auth user, open Authentication > Users, copy the user's UUID,
-- then run this line with the real UUID so only that account can use /admin.
-- insert into public.admin_profiles (user_id) values ('00000000-0000-0000-0000-000000000000');
