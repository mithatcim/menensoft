# Supabase — kurulum (Phase 33C)

Form gönderimlerinin (`leads`) veritabanı kurulumu. Yayından önce yapılması
gerekenler burada; site bu adımlar yapılmadan da çalışır (formlar dürüst bir
hata gösterir ve ziyaretçiyi e-posta/WhatsApp'a yönlendirir).

## 0. Bilmeniz gereken tek güvenlik kuralı

`leads` tablosuna **yalnızca sunucu** yazar. Tarayıcı Supabase ile hiç konuşmaz.
RLS **açık** ve **hiçbir policy yok** — RLS açık + policy yok demek "anon ve
authenticated hiçbir satırı göremez" demektir. Service role RLS'i baypas eder,
bu yüzden `/api/lead` çalışır.

> Buradaki en tehlikeli hata "geçici" bir select policy eklemektir. `leads`
> policy aldığı anda anon key ile herkese açık bir müşteri veritabanına dönüşür.
> Bu bir kesinti değil, veri sızıntısıdır. **Policy eklemeyin.**

`SUPABASE_SERVICE_ROLE_KEY` bu tablonun tek anahtarıdır:

- **ASLA** `NEXT_PUBLIC_` öneki verilmez (öneki alan her şey tarayıcıya gömülür),
- **ASLA** client component'e import edilmez,
- **ASLA** commit edilmez (`.env*` git tarafından yok sayılır; `.env.example` şablondur).

## 1. Supabase projesi oluşturun

supabase.com → New project. Bölge olarak ziyaretçilerinize yakın olanı seçin
(TR ağırlıklı trafik için `eu-central-1` makul).

## 2. Şemayı çalıştırın

Supabase Dashboard → **SQL Editor** → yeni sorgu → `supabase/schema.sql`
içeriğini yapıştırıp çalıştırın. Idempotent: tekrar çalıştırmak güvenlidir.

Oluşturur: `leads`, `lead_rate_limits`, `rate_limit_lead()` fonksiyonu,
indeksler, kısıtlar ve RLS.

## 3. Yerel ortam değişkenleri

`.env.local` (git tarafından yok sayılır):

```
SUPABASE_URL=https://<proje-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role key>
```

Dashboard → Project Settings → API. **`anon` key değil, `service_role` key.**

Değişkenler yoksa yerel `pnpm build`, `pnpm start` ve `pnpm audit:browser`
sorunsuz çalışmaya devam eder — bu bilinçli.

## 4. Vercel (yayın sırasında)

Settings → Environment Variables → **Production**:

| Değişken | Değer |
| --- | --- |
| `SUPABASE_URL` | `https://<proje-ref>.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key |
| `CRON_SECRET` | rastgele uzun bir dize (aşağı bakın) |

Preview ortamına eklemeyin: preview deploy'ları gerçek lead tablosuna
yazmamalıdır.

## 5. `/api/lead` testi

```
curl -i -X POST http://localhost:3010/api/lead \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Deneme mesajı","language":"tr","formStartedAt":'"$(( $(date +%s000) - 10000 ))"'}'
```

Beklenen: `200 {"ok":true,"id":"<uuid>"}`.

- `formStartedAt` **10 sn öncesi** olmalı: 3 sn'den hızlı gönderimler bot sayılır
  ve sessizce atılır (yanıt yine `200` görünür — bota ipucu verilmez).
- Değişkenler eksikse: `503 {"code":"unconfigured"}`. **Bu doğru davranıştır.**

Tarayıcıdan: `/teklif-al` veya `/iletisim` → formu doldurun → gönderin.

## 6. Lead'in tabloya düştüğünü doğrulayın

Dashboard → Table Editor → `leads`. Kontrol edin:

- `status = 'new'`
- `language` doğru (`tr` / `en`)
- `source_path` = `/teklif-al`, `/en/start-project`, `/iletisim`, `/en/contact`
- Sihirbazdan geldiyse `selected_fit_id`, `selected_situation`,
  `reference_project_slug` dolu
- `device_type` = `mobile` / `tablet` / `desktop` (sunucuda türetilir)
- `country` yerelde **null** (yalnızca Vercel'de `x-vercel-ip-country` gelir)
- **`ip` sütunu yok** — olmayan sütun sızmaz

## 7. Anon erişimin KAPALI olduğunu doğrulayın

Bu adımı atlamayın. Politikayı yanlış kuran biri müşteri listesini herkese açar.

```
curl "https://<proje-ref>.supabase.co/rest/v1/leads?select=*" \
  -H "apikey: <ANON key>" \
  -H "Authorization: Bearer <ANON key>"
```

Beklenen: **`[]`** (boş dizi) — tablo dolu olsa bile. Satır dönüyorsa bir policy
eklenmiş demektir; kaldırın.

SQL ile de doğrulanabilir:

```sql
select relrowsecurity from pg_class where relname = 'leads';   -- true olmalı
select count(*) from pg_policies where tablename = 'leads';    -- 0 olmalı
```

## 8. Ücretsiz katman: proje duraklaması ⚠

**Ücretsiz Supabase projeleri ~7 gün hareketsizlik sonrası duraklar.** Yeni ve
sessiz bir site tam olarak bu duruma düşer; sonuç, **ilk gerçek lead'in duraklamış
bir veritabanına çarpmasıdır**. Bu projenin göze alamayacağı tek hata budur.

Bu yüzden keepalive `/api/cron/supabase-keepalive` olarak bu fazda geldi. Sayım
sorgusu çalıştırır (satır döndürmez), bu da "aktivite" saymaya yeter.

`CRON_SECRET` yoksa uç **kapalı kalır** (503), açık değil: korumasız bir cron
ucu, kotanızı harcamak için bedava bir yoldur.

Yerel test:

```
curl -H "Authorization: Bearer <CRON_SECRET>" \
  http://localhost:3010/api/cron/supabase-keepalive
# {"ok":true,"leads":<sayı>}
```

### Vercel Cron ile zamanlama (yayında)

Repo köküne `vercel.json` ekleyin — **bu dosya bilinçli olarak commit edilmedi**;
deploy yapılandırması tahminle değiştirilmez:

```json
{
  "crons": [
    { "path": "/api/cron/supabase-keepalive", "schedule": "0 6 * * *" }
  ]
}
```

Vercel, `Authorization: Bearer $CRON_SECRET` başlığını kendisi gönderir.
Günde bir kez fazlasıyla yeterlidir (eşik ~7 gün).

Alternatif: Supabase'i Pro'ya yükseltirseniz duraklama sorunu ortadan kalkar ve
cron'a gerek kalmaz.

## 9. Yayın öncesi kontrol listesi

- [ ] Şema çalıştırıldı; `pg_policies` sayısı `leads` için **0**
- [ ] Anon key ile `leads` sorgusu **boş dizi** dönüyor
- [ ] `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` Vercel **Production**'da
- [ ] `CRON_SECRET` Vercel'de + `vercel.json` cron eklendi
- [ ] Dört sayfadan da gerçek gönderim yapıldı, dördü de tabloya düştü
- [ ] Supabase kapalıyken form **sahte başarı göstermiyor**, e-posta/WhatsApp'a
      yönlendiriyor (env'leri geçici kaldırıp deneyin)
