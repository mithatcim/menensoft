-- Menensoft — Supabase şeması (Phase 33C).
--
-- Supabase SQL Editor'de bir kez çalıştırın. Idempotent: tekrar çalıştırmak
-- güvenlidir.
--
-- GÜVENLİK MODELİ — bilinçli ve tek cümleyle özetlenebilir:
-- Bu tabloya yalnızca sunucu yazar. Tarayıcı Supabase ile hiç konuşmaz.
-- Form gönderimi /api/lead route handler'ına gider; oradan service role key ile
-- insert edilir. Bu yüzden RLS AÇIK ve HİÇBİR policy yok — policy'siz + RLS açık
-- demek "anon ve authenticated hiçbir satırı göremez, yazamaz" demektir.
-- Service role RLS'i baypas eder, dolayısıyla sunucu tarafı çalışmaya devam eder.
--
-- Buradaki en tehlikeli hata bir "geçici" select policy eklemektir: leads tablosu
-- policy aldığı anda, anon key ile herkese açık bir müşteri veritabanına dönüşür.
-- Kesinti değil, veri sızıntısı olur. Policy EKLEMEYİN.
--
-- GİZLİLİK: ham IP saklanmaz. IP sütunu yok — olmayan sütun sızmaz. Ülke bilgisi
-- yalnızca Vercel'in x-vercel-ip-country başlığından 2 harfli kod olarak gelir.
-- Rate limit için IP hash'lenir (aşağıya bakın), ham hali hiçbir yere yazılmaz.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- leads
-- ---------------------------------------------------------------------------
create table if not exists public.leads (
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
  -- kısıt, uygulama bir gün yanılırsa diye son savunma hattı.
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
    device_type is null or device_type in ('mobile', 'tablet', 'desktop')
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
  -- Uzunluk tavanları: /api/lead zaten kırpıyor, bu tabloyu şişme ve kötüye
  -- kullanıma karşı bağımsız olarak korur.
  constraint leads_lengths check (
    length(name) between 1 and 120
    and length(message) between 1 and 1500
    and (email is null or length(email) <= 200)
    and (phone is null or length(phone) <= 40)
  )
);

comment on table public.leads is
  'Form gönderimleri. Yalnızca service role erişir (/api/lead). RLS açık, policy YOK — policy eklemek tabloyu herkese açar.';
comment on column public.leads.country is
  '2 harfli ülke kodu (x-vercel-ip-country). Ham IP saklanmaz.';
comment on column public.leads.user_agent is
  'Yalnızca gerçek bir lead üzerinde tutulur; sayfa görüntülemelerde tutulmaz.';

create index if not exists leads_created_at_idx
  on public.leads (created_at desc);
create index if not exists leads_status_idx
  on public.leads (status, created_at desc);
create index if not exists leads_fit_id_idx
  on public.leads (selected_fit_id)
  where selected_fit_id is not null;

alter table public.leads enable row level security;
-- Kasıtlı olarak POLICY YOK. Yukarıdaki güvenlik notunu okuyun.

-- ---------------------------------------------------------------------------
-- lead_rate_limits
-- ---------------------------------------------------------------------------
-- Serverless'ta bellek içi sayaç işe yaramaz: her istek başka bir instance'a
-- düşebilir. Sayaç paylaşılan bir yerde durmalı; en yakın paylaşılan yer zaten
-- kullandığımız veritabanı.
--
-- ip_hash: sha256(ip + salt). Ham IP ne buraya ne başka bir yere yazılır; hash
-- yalnızca "aynı istemci mi" sorusunu cevaplar, kimliği taşımaz.
create table if not exists public.lead_rate_limits (
  ip_hash      text primary key,
  window_start timestamptz not null default now(),
  count        integer not null default 0
);

alter table public.lead_rate_limits enable row level security;
-- Burada da policy yok: yalnızca service role dokunur.

comment on table public.lead_rate_limits is
  'IP hash başına gönderim sayacı. Ham IP saklanmaz.';

-- Tek atomik çağrı: sayacı artır ve izin verilip verilmediğini döndür.
-- "Önce oku, sonra yaz" iki eşzamanlı istekte limiti kaçırır; upsert ... returning
-- yarışı tek ifadede kapatır.
create or replace function public.rate_limit_lead(
  p_hash   text,
  p_max    integer  default 5,
  p_window interval default '10 minutes'
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  insert into public.lead_rate_limits (ip_hash, window_start, count)
  values (p_hash, now(), 1)
  on conflict (ip_hash) do update
    set count = case
          when public.lead_rate_limits.window_start < now() - p_window then 1
          else public.lead_rate_limits.count + 1
        end,
        window_start = case
          when public.lead_rate_limits.window_start < now() - p_window then now()
          else public.lead_rate_limits.window_start
        end
  returning count into v_count;

  return v_count <= p_max;
end;
$$;

revoke all on function public.rate_limit_lead(text, integer, interval) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Doğrulama (Supabase SQL Editor'de çalıştırın)
-- ---------------------------------------------------------------------------
-- select relrowsecurity from pg_class where relname = 'leads';           -- true olmalı
-- select count(*) from pg_policies where tablename = 'leads';            -- 0 olmalı
