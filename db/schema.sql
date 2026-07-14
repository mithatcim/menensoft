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
-- CRM alanları (Phase 36A) — tamamen eklemeli
-- ---------------------------------------------------------------------------
-- Panel bir gelen kutusundan çalışma aracına dönüşüyor. Buradaki her şey
-- eklemeli: hiçbir satır silinmez, hiçbir sütun düşürülmez, mevcut durumlar
-- olduğu gibi geçerli kalır.
--
-- NOT: Bu sütunlar YAYINDAN ÖNCE eklenmelidir. Yakalanmayan veri geri
-- getirilemez — bir lead geldiği anda damgalanmayan zaman bilgisi sonradan
-- uydurulamaz.

alter table leads add column if not exists updated_at        timestamptz not null default now();
alter table leads add column if not exists read_at           timestamptz;
alter table leads add column if not exists last_contacted_at timestamptz;
alter table leads add column if not exists follow_up_at      timestamptz;
alter table leads add column if not exists won_at            timestamptz;
alter table leads add column if not exists lost_at           timestamptz;
alter table leads add column if not exists lost_reason       text;
alter table leads add column if not exists priority          text;

comment on column leads.updated_at is
  'Son değişiklik. "En uzun bekleyen" sıralaması bunun üzerinden çalışır.';
comment on column leads.follow_up_at is
  'Sahibin kendine koyduğu hatırlatma. Geçmişte kaldıysa panelde "gecikmiş" görünür.';

-- Satış hattı: 4 durumdan 8 duruma. Kısıtı düşürüp yeniden kurmak idempotenttir
-- ve VERİYE DOKUNMAZ — eski dört durum yeni kümenin alt kümesidir, yani mevcut
-- satırlar olduğu gibi geçerli kalır.
--
-- Dürüst uyarı, koda gömülü olsun: ara aşamalar (nitelikli, teklif gönderildi)
-- güncellenmeyi UNUTULAN ilk aşamalardır. Güncellenmeyen bir aşama boş değildir,
-- YANLIŞTIR — ve üstüne kurulan her dönüşüm sayısı da yanlış olur. Bu yüzden
-- dönüşüm hesapları yalnızca won/lost üzerinden yapılır; aşamalar atlanabilir.
alter table leads drop constraint if exists leads_status;
alter table leads add  constraint leads_status check (
  status in (
    'new', 'read', 'contacted', 'qualified',
    'proposal_sent', 'won', 'lost', 'archived'
  )
);

alter table leads drop constraint if exists leads_priority;
alter table leads add  constraint leads_priority check (
  priority is null or priority in ('low', 'normal', 'high')
);

alter table leads drop constraint if exists leads_lost_reason_len;
alter table leads add  constraint leads_lost_reason_len check (
  lost_reason is null or length(lost_reason) <= 300
);

create index if not exists leads_follow_up_idx
  on leads (follow_up_at)
  where follow_up_at is not null;
create index if not exists leads_last_contacted_idx
  on leads (last_contacted_at);
create index if not exists leads_updated_at_idx
  on leads (updated_at desc);

-- ---------------------------------------------------------------------------
-- lead_notes (Phase 36A)
-- ---------------------------------------------------------------------------
-- EKLEMELİ bir zaman çizelgesi, tek bir "notes" sütunu değil. Sebep basit: tek
-- bir metin alanı üzerine yazılır ve ne zaman ne söylendiği kaybolur. Bir aramayı
-- ya da bir durum değişimini geri izleyebilmek, notun kendisi kadar değerlidir.
--
-- Durum değişimleri buraya OTOMATİK düşer: "kim ne zaman neyi değiştirdi"
-- sorusunun cevabı hatırlamaya bırakılmaz.
create table if not exists lead_notes (
  id         uuid primary key default gen_random_uuid(),
  lead_id    uuid not null references leads(id) on delete cascade,
  created_at timestamptz not null default now(),
  note       text not null,
  note_type  text not null default 'note',
  created_by text,
  metadata   jsonb not null default '{}'::jsonb,

  constraint lead_notes_type check (
    note_type in (
      'note', 'call', 'whatsapp', 'email',
      'status_change', 'follow_up', 'system'
    )
  ),
  constraint lead_notes_len check (length(note) between 1 and 2000)
);

comment on table lead_notes is
  'Lead başına eklemeli zaman çizelgesi. Durum değişimleri otomatik düşer.';

create index if not exists lead_notes_lead_idx
  on lead_notes (lead_id, created_at desc);

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
-- Analitik (Phase 33E) — çerezsiz, birinci taraf
-- ---------------------------------------------------------------------------
-- TASARIM, TEK PARAGRAF:
-- Ziyaretçi kimliği tarayıcıda DEĞİL, sunucuda türetilir:
--   visitor_key = sha256(günlük_tuz + ip + user_agent + site)
-- IP yalnızca bellekte, hash'i hesaplamak için kullanılır ve HİÇBİR YERE yazılmaz.
-- Tuz her gün döner, yani aynı kişi yarın farklı bir anahtar alır: kimse günler
-- boyunca izlenemez. Bu yüzden çerez yok, localStorage yok, parmak izi yok — ve
-- bu yüzden çerez banner'ı da yok. Ziyaretçinin cihazına hiçbir şey yazılmıyor.
--
-- Bunun bedeli: "dün gelen kişi bugün geri döndü mü?" sorusunu yanıtlayamayız.
-- Bu iş için o soru gerekli değil.
--
-- SAKLANMAYANLAR (kasıtlı, sütun bile yok):
--   - ham IP
--   - tam user-agent (yalnızca mobile/tablet/desktop/unknown türetilir)
--   - tam referrer URL (yalnızca HOST; tam URL arama sorgusu ya da özel yol taşır)
--   - parmak izi / cihaz imzası

create table if not exists visitor_sessions (
  id              uuid primary key default gen_random_uuid(),
  visitor_key     text not null,
  created_at      timestamptz not null default now(),
  last_seen_at    timestamptz not null default now(),
  first_path      text,
  last_path       text,
  locale          text,
  referrer_host   text,
  device_type     text,
  country         text,
  pageview_count  integer not null default 0,
  duration_seconds integer not null default 0,

  constraint vs_device_type check (
    device_type is null
    or device_type in ('mobile', 'tablet', 'desktop', 'unknown')
  ),
  constraint vs_locale check (locale is null or locale in ('tr', 'en')),
  -- referrer_host bir HOST'tur: içinde / ? # olamaz. Tam URL kaçarsa bu kısıt
  -- yakalar — "yalnızca host saklıyoruz" bir söz değil, bir kural olsun.
  constraint vs_referrer_is_host check (
    referrer_host is null or referrer_host !~ '[/?#]'
  )
);

create table if not exists analytics_events (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  session_id    uuid references visitor_sessions(id) on delete set null,
  event_type    text not null,
  path          text,
  locale        text,
  referrer_host text,
  device_type   text,
  country       text,
  metadata      jsonb not null default '{}'::jsonb,

  constraint ae_event_type check (
    event_type in (
      'session_start', 'page_view', 'cta_click', 'proof_click',
      'email_click', 'whatsapp_click', 'form_submit', 'language_switch',
      'heartbeat'
    )
  ),
  constraint ae_locale check (locale is null or locale in ('tr', 'en')),
  constraint ae_device_type check (
    device_type is null
    or device_type in ('mobile', 'tablet', 'desktop', 'unknown')
  ),
  constraint ae_referrer_is_host check (
    referrer_host is null or referrer_host !~ '[/?#]'
  ),
  -- metadata şişmesin: /api/e zaten kırpıyor, bu bağımsız tavan.
  constraint ae_metadata_size check (length(metadata::text) <= 1000)
);

comment on table visitor_sessions is
  'Çerezsiz oturumlar. visitor_key = sha256(günlük tuz + ip + UA + site). Ham IP saklanmaz, kimlik günler arası taşınmaz.';
comment on table analytics_events is
  'Birinci taraf olaylar. Kişisel veri taşımaz: mesaj/e-posta/telefon buraya asla yazılmaz.';
comment on column visitor_sessions.duration_seconds is
  'YAKLAŞIK: son olay ile ilk olay arası. Son sayfanın gerçek okunma süresi bilinemez.';
comment on column visitor_sessions.referrer_host is
  'Yalnızca host. Tam URL asla saklanmaz — arama sorgusu ya da özel yol taşıyabilir.';

create index if not exists ae_created_at_idx on analytics_events (created_at desc);
create index if not exists ae_type_created_idx on analytics_events (event_type, created_at desc);
create index if not exists ae_session_created_idx on analytics_events (session_id, created_at);
create index if not exists ae_path_idx on analytics_events (path) where path is not null;

create index if not exists vs_created_at_idx on visitor_sessions (created_at desc);
create index if not exists vs_last_seen_idx on visitor_sessions (last_seen_at desc);
create index if not exists vs_visitor_key_idx on visitor_sessions (visitor_key, last_seen_at desc);

-- SAKLAMA SÜRESİ (öneri: 12 ay). Zamanlanmış silme kasıtlı olarak eklenmedi —
-- veri silen bir cron'u yanlış kurmak, hiç kurmamaktan kötüdür. Hazır olduğunuzda:
--   delete from analytics_events  where created_at < now() - interval '12 months';
--   delete from visitor_sessions  where last_seen_at < now() - interval '12 months';
-- (leads bir iş kaydıdır; o silinmez.)

-- ===========================================================================
-- PROJE CMS (Phase 38A)
-- ===========================================================================
--
-- Bu tablolar HAZIRLIKTIR. Herkese açık proje sayfaları 38A boyunca hâlâ
-- src/content/projects.ts ve src/content/en/projects.ts dosyalarını okur.
-- Veritabanına geçiş 38C'de yapılacak. Tabloların şimdi var olması, içeriğin
-- yayına çıkmadan önce doğrulanabilmesi içindir.
--
-- Model: kimlik/yönlendirme/yayın durumu `projects` içinde (indekslenebilir,
-- kısıtlanabilir); çevrilen metin `project_translations` içinde. Sıralı listeler
-- (built/flow/constraints/modules) JSONB'dir: bunlar bağımsız kimliği olmayan
-- sıralı dizilerdir, ayrı tabloya normalize etmek yalnızca join ve yönetim
-- arayüzü karmaşıklığı üretirdi.

create table if not exists projects (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  status         text not null default 'draft',
  tier           text not null,
  featured       boolean not null default false,
  sort_order     integer not null default 0,
  -- fit.ts'teki projectToFitType haritasının yerini alır: eşleme veriye taşınır.
  fit_id         text,
  -- stack iki dilde birebir aynı ("Next.js", "TypeScript") — çeviri değil.
  stack          jsonb not null default '[]'::jsonb,
  year           text,
  live_url       text,
  repo_url       text,
  image          text,
  image_alt      text,
  internal_notes text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  published_at   timestamptz,
  archived_at    timestamptz,

  -- Slug bir ROTA'dır. Serbest metin olarak bırakılırsa yol geçişi (../) ya da
  -- rota enjeksiyonu için bir yüzey olur. Kısıt burada, veritabanında durur:
  -- uygulama katmanı unutabilir, tablo unutmaz.
  constraint projects_slug_safe check (slug ~ '^[a-z0-9][a-z0-9-]{1,58}[a-z0-9]$'),
  constraint projects_status check (status in ('draft', 'published', 'archived')),
  constraint projects_tier check (tier in ('delivered', 'internal')),
  constraint projects_stack_is_array check (jsonb_typeof(stack) = 'array'),
  constraint projects_url_shape check (
    (live_url is null or live_url ~ '^https?://')
    and (repo_url is null or repo_url ~ '^https?://')
  )
);

create unique index if not exists projects_slug_idx on projects (slug);
create index if not exists projects_status_order_idx on projects (status, sort_order);
create index if not exists projects_featured_idx on projects (featured) where featured;
create index if not exists projects_fit_idx on projects (fit_id) where fit_id is not null;

create table if not exists project_translations (
  id               uuid primary key default gen_random_uuid(),
  project_id       uuid not null references projects(id) on delete cascade,
  locale           text not null,
  name             text not null,
  one_liner        text not null,
  problem          text not null,
  status_label     text not null,
  status_note      text,
  similar_cta      text,
  role             text,
  dossier_summary  text,
  -- SEO alanları BUGÜN yok: meta başlık name'den, açıklama one_liner'dan
  -- türetiliyor. Null bırakılırsa davranış bugünküyle birebir aynı kalır;
  -- dolu bırakılırsa override olur. Seed bunları bilerek boş bırakır.
  meta_title       text,
  meta_description text,
  og_title         text,
  og_description   text,
  built            jsonb not null default '[]'::jsonb,
  flow             jsonb not null default '[]'::jsonb,
  -- `constraints` PostgreSQL'de fazlasıyla yüklü bir kelime; ayrıca ORM'siz
  -- ham SQL'de okurken "hangi constraint?" diye durup düşündürür. _list soneki
  -- bu duraksamayı ortadan kaldırır.
  constraints_list jsonb not null default '[]'::jsonb,
  modules          jsonb not null default '[]'::jsonb,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),

  constraint project_translations_locale check (locale in ('tr', 'en')),
  constraint project_translations_unique unique (project_id, locale),
  constraint project_translations_arrays check (
    jsonb_typeof(built) = 'array'
    and jsonb_typeof(flow) = 'array'
    and jsonb_typeof(constraints_list) = 'array'
    and jsonb_typeof(modules) = 'array'
  ),
  constraint project_translations_lengths check (
    length(name) between 1 and 120
    and length(one_liner) between 1 and 300
    and length(problem) between 1 and 2000
    and length(status_label) between 1 and 80
    and (meta_title is null or length(meta_title) <= 120)
    and (meta_description is null or length(meta_description) <= 320)
  )
);

create index if not exists project_translations_project_idx
  on project_translations (project_id, locale);

-- Slug değişirse eski bağlantı ölmemeli. Eski slug burada yaşar; [slug] sayfası
-- 38C'de bir ıskalamada buraya bakıp 308 verecek. next.config.ts'e yazmak yerine
-- tabloda tutulur: yeni bir yönlendirme kod değişikliği ve yeniden derleme
-- gerektirmemelidir.
create table if not exists project_slug_redirects (
  id         uuid primary key default gen_random_uuid(),
  old_slug   text not null unique,
  project_id uuid not null references projects(id) on delete cascade,
  created_at timestamptz not null default now(),

  constraint project_slug_redirects_safe check (
    old_slug ~ '^[a-z0-9][a-z0-9-]{1,58}[a-z0-9]$'
  )
);

create unique index if not exists project_slug_redirects_old_idx
  on project_slug_redirects (old_slug);

-- Bir slug hem canlı bir projeye hem de eski bir yönlendirmeye ait olamaz:
-- olursa yönlendirme kendi hedefini gölgeler ve sayfa sonsuz döngüye girer.
-- Bunu bir CHECK ile ifade etmek mümkün değil (tablolar arası), bu yüzden
-- tetikleyici ile kapatılır.
create or replace function project_slug_redirect_guard() returns trigger as $$
begin
  if exists (select 1 from projects where slug = new.old_slug) then
    raise exception
      'old_slug "%" is a live project slug; a redirect would shadow its own target',
      new.old_slug;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists project_slug_redirects_guard on project_slug_redirects;
create trigger project_slug_redirects_guard
  before insert or update on project_slug_redirects
  for each row execute function project_slug_redirect_guard();

comment on table projects is
  'Proje CMS kimlik/yönlendirme/yayın katmanı. 38A: yalnızca hazırlık — herkese açık sayfalar hâlâ typed dosyaları okur.';
comment on table project_translations is
  'Dile bağlı proje metni. Bugün EN ve TR aynı slug''ı paylaşır; çevrilmiş slug YOK.';
comment on table project_slug_redirects is
  'Slug değişince eski bağlantıyı yaşatır. 38C''de [slug] sayfası burada arayıp 308 verecek.';

-- ---------------------------------------------------------------------------
-- Doğrulama
-- ---------------------------------------------------------------------------
-- \d leads
-- select count(*) from leads;
-- select column_name from information_schema.columns
--   where table_name = 'leads' and column_name in ('ip', 'ip_address');  -- 0 satır
-- select slug, status, sort_order from projects order by sort_order;      -- 5 satır
-- select locale, count(*) from project_translations group by locale;      -- tr 5, en 5
