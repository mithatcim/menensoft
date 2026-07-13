-- Menensoft — PostgreSQL şeması (Phase 33C-PG).
--
-- Sağlayıcıdan bağımsız. Herhangi bir PostgreSQL 13+ üzerinde çalışır: yerel
-- Docker, Neon, Render, Railway, kendi sunucunuz. Bağlanma bilgisi tek bir
-- DATABASE_URL'dir; başka hiçbir hesap, dashboard ya da SDK gerekmez.
--
-- Çalıştırma:  psql "$DATABASE_URL" -f db/schema.sql
-- Idempotent: tekrar çalıştırmak güvenlidir.
--
-- GÜVENLİK MODELİ — tek cümle:
-- Bu tabloya yalnızca sunucu erişir. Tarayıcı veritabanıyla hiç konuşmaz.
-- Erişim tek bir yerden olur: /api/lead route handler'ı, DATABASE_URL ile,
-- parametreli SQL kullanarak. Bu yüzden burada "policy" ya da satır düzeyinde
-- güvenlik yoktur — veritabanı zaten yalnızca sunucuya açıktır. Güvenlik sınırı
-- ağ katmanındadır: DATABASE_URL asla tarayıcıya ulaşmaz ve asla NEXT_PUBLIC_
-- öneki almaz.
--
-- Uygulamanın kullandığı rolü mümkünse yalnızca bu iki tabloya yetkili yapın;
-- superuser gerekmez.
--
-- GİZLİLİK: ham IP saklanmaz. leads tablosunda IP sütunu YOKTUR — olmayan sütun
-- sızmaz. Rate limit için IP hash'lenir (aşağı bakın), ham hâli hiçbir yere
-- yazılmaz. Ülke yalnızca hosting başlığından gelen 2 harfli koddur.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- leads
-- ---------------------------------------------------------------------------
create table if not exists leads (
  id                     uuid primary key default gen_random_uuid(),
  created_at             timestamptz not null default now(),

  name                   text not null,
  email                  text,
  phone                  text,
  message                text not null,

  language               text not null,
  selected_fit_id        text,
  selected_situation     text,
  reference_project_slug text,
  source_path            text,
  contact_preference     text not null default 'unknown',
  status                 text not null default 'new',

  device_type            text,
  country                text,
  session_id             text,
  user_agent             text,

  -- Bir lead ya e-posta ya telefon taşımalı: ikisi de yoksa geri dönülemez,
  -- yani kaydın hiçbir değeri yok. Uygulama katmanı da bunu doğruluyor; bu
  -- kısıt, uygulama bir gün yanılırsa diye son savunma hattıdır.
  constraint leads_reachable check (
    (email is not null and length(email) > 0)
    or (phone is not null and length(phone) > 0)
  ),
  constraint leads_status check (
    status in ('new', 'read', 'contacted', 'archived')
  ),
  constraint leads_language check (language in ('tr', 'en')),
  constraint leads_contact_preference check (
    contact_preference in ('form', 'email', 'whatsapp', 'unknown')
  ),
  constraint leads_device_type check (
    device_type is null
    or device_type in ('mobile', 'tablet', 'desktop', 'unknown')
  ),
  -- src/content/fit.ts ile birebir. Id'ler iki dilde de aynı (locale-stable),
  -- bu yüzden tek liste yeterli. fit.ts'e yeni bir sistem eklerseniz burayı da
  -- güncelleyin — yoksa insert reddedilir.
  constraint leads_fit_id check (
    selected_fit_id is null or selected_fit_id in (
      'e-ticaret', 'yonetim-paneli', 'kurumsal-site',
      'dashboard', 'otomasyon', 'operasyon', 'emin-degilim'
    )
  ),
  constraint leads_situation check (
    selected_situation is null or selected_situation in (
      'sifirdan', 'yetersiz', 'manuel', 'platform', 'fikir', 'toparlama'
    )
  ),
  -- Uzunluk tavanları: /api/lead zaten kırpıyor; bu, tabloyu uygulamadan
  -- bağımsız olarak şişmeye ve kötüye kullanıma karşı korur.
  constraint leads_lengths check (
    length(name) between 1 and 120
    and length(message) between 1 and 1500
    and (email is null or length(email) <= 200)
    and (phone is null or length(phone) <= 40)
    and (user_agent is null or length(user_agent) <= 400)
  )
);

comment on table leads is
  'Form gönderimleri. Yalnızca sunucu (/api/lead) yazar; tarayıcı veritabanına erişmez.';
comment on column leads.country is
  '2 harfli ülke kodu (hosting başlığından). Ham IP saklanmaz.';
comment on column leads.user_agent is
  'Yalnızca gerçek bir lead üzerinde tutulur; sayfa görüntülemelerde tutulmaz.';

create index if not exists leads_created_at_idx
  on leads (created_at desc);
create index if not exists leads_status_idx
  on leads (status, created_at desc);
create index if not exists leads_fit_id_idx
  on leads (selected_fit_id)
  where selected_fit_id is not null;
create index if not exists leads_source_path_idx
  on leads (source_path)
  where source_path is not null;

-- ---------------------------------------------------------------------------
-- lead_rate_limits
-- ---------------------------------------------------------------------------
-- Serverless'ta bellek içi sayaç işe yaramaz: ardışık iki istek farklı bir
-- instance'a düşebilir. Sayaç paylaşılan bir yerde durmalı; en yakın paylaşılan
-- yer zaten kullandığımız veritabanıdır.
--
-- ip_hash: sha256(ip + salt). Ham IP ne buraya ne başka bir yere yazılır; hash
-- yalnızca "aynı gönderen mi" sorusunu yanıtlar, kimlik taşımaz.
create table if not exists lead_rate_limits (
  ip_hash      text primary key,
  window_start timestamptz not null default now(),
  count        integer not null default 0
);

comment on table lead_rate_limits is
  'IP hash başına gönderim sayacı. Ham IP saklanmaz.';

-- Eski pencereleri temizlemek isterseniz (opsiyonel, cron ile):
--   delete from lead_rate_limits where window_start < now() - interval '1 day';

-- ---------------------------------------------------------------------------
-- admin_login_attempts (Phase 33D)
-- ---------------------------------------------------------------------------
-- Aynı yapı, farklı amaç: /admin/login'e kaba kuvvet denemesini yavaşlatır.
-- Ayrı tablo, çünkü eşikleri farklıdır — bir ziyaretçinin 10 dakikada 5 form
-- göndermesi normaldir; 10 dakikada 5 kez yanlış parola girmesi değildir.
--
-- Burada da ham IP saklanmaz: yalnızca sha256(ip + salt).
--
-- ÖNEMLİ: leads rate limit'inden farklı olarak bu limit FAIL CLOSED'dır.
-- Veritabanı yoksa giriş denemesi reddedilir. Bozuk bir limitleyici, kaba
-- kuvvet saldırısına açık bir giriş formundan iyidir; kaybedilen tek şey
-- sahibin birkaç dakikalık erişimidir, veri değil.
create table if not exists admin_login_attempts (
  ip_hash      text primary key,
  window_start timestamptz not null default now(),
  count        integer not null default 0
);

comment on table admin_login_attempts is
  'Admin giriş denemesi sayacı (IP hash başına). Ham IP saklanmaz.';

-- ---------------------------------------------------------------------------
-- Doğrulama
-- ---------------------------------------------------------------------------
-- \d leads
-- select count(*) from leads;
-- select column_name from information_schema.columns
--   where table_name = 'leads' and column_name in ('ip', 'ip_address');  -- 0 satır
