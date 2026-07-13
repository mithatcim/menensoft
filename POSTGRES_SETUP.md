# PostgreSQL — kurulum (Phase 33C-PG)

Form gönderimlerinin (`leads`) veritabanı kurulumu.

Sağlayıcı bağımsızdır: tek gereken bir **PostgreSQL bağlantı dizesi**. Hesap,
dashboard, SDK yok. Yerel Docker, Neon, Render, Railway, Hetzner'daki kendi
sunucunuz — uygulama açısından hepsi aynı.

Site bu adımlar yapılmadan da çalışır: `DATABASE_URL` yoksa formlar **dürüst bir
hata** gösterir ve ziyaretçiyi e-posta/WhatsApp'a yönlendirir. Sahte başarı
gösterilmez.

## 0. Bilmeniz gereken tek güvenlik kuralı

Veritabanına **yalnızca sunucu** erişir. Tarayıcı veritabanıyla hiç konuşmaz.
Tek erişim noktası `/api/lead` route handler'ıdır ve **parametreli SQL** kullanır.

Güvenlik sınırı ağ katmanındadır, satır düzeyinde policy değil. Bu yüzden tüm
ağırlık tek bir kurala biner:

> **`DATABASE_URL` asla tarayıcıya ulaşmaz.**
>
> - **ASLA** `NEXT_PUBLIC_` öneki verilmez (öneki alan her şey client bundle'a gömülür),
> - **ASLA** client component'e import edilmez,
> - **ASLA** commit edilmez (`.env*` git tarafından yok sayılır; `.env.example` şablondur).

Uygulamanın kullandığı veritabanı rolünü mümkünse yalnızca `leads` ve
`lead_rate_limits` tablolarına yetkili yapın. Superuser gerekmez.

## 1. Seçenek A — yerel PostgreSQL (Docker)

Geliştirme ve test için en hızlısı:

```bash
docker run -d --name websitem-pg \
  -e POSTGRES_USER=menensoft \
  -e POSTGRES_PASSWORD=devpass \
  -e POSTGRES_DB=menensoft \
  -p 5433:5432 \
  postgres:16-alpine
```

> Port **5433** bilinçli: 5432 başka bir projede kullanılıyor olabilir.

Şemayı uygulayın:

```bash
docker exec -i websitem-pg psql -U menensoft -d menensoft < db/schema.sql
```

`.env.local` (git tarafından yok sayılır):

```
DATABASE_URL=postgresql://menensoft:devpass@localhost:5433/menensoft
LEAD_RATE_LIMIT_SALT=uzun-rastgele-bir-dize
```

Yerelde TLS yoktur ve gerekmez; kod `localhost` gördüğünde SSL'i kapatır.

### Docker yoksa

PostgreSQL'i doğrudan kurun (postgresql.org), bir veritabanı açın ve şemayı
`psql "$DATABASE_URL" -f db/schema.sql` ile uygulayın.

## 2. Seçenek B — hosted PostgreSQL

PostgreSQL bağlantı dizesi veren **herhangi bir** sağlayıcı çalışır. Şemayı
uygulayın:

```bash
psql "postgresql://user:password@host:5432/dbname?sslmode=require" -f db/schema.sql
```

**Serverless'a (Vercel) deploy ediyorsanız sağlayıcınızın POOLED (havuzlanmış)
bağlantı dizesini kullanın.** Doğrudan bağlantı dizesiyle, her serverless
instance kendi havuzunu açar ve çok az trafikle bile veritabanının bağlantı
limiti tükenir. Bu, düşük trafikte bile insanları vuran klasik hatadır.

TLS: kod, `localhost` dışındaki her host için TLS'i açar. `sslmode=disable`
yazarsanız kapatır.

## 3. Ortam değişkenleri

| Değişken | Zorunlu mu | Ne için |
| --- | --- | --- |
| `DATABASE_URL` | Formlar için evet | Tek bağlantı bilgisi. Yoksa formlar 503 döner, site çalışır. |
| `LEAD_RATE_LIMIT_SALT` | Hayır (önerilir) | IP hash'inin tuzu. Boşsa `DATABASE_URL` tuz olarak kullanılır. |
| `CRON_SECRET` | Yalnızca keepalive kullanılıyorsa | `/api/cron/db-keepalive` koruması. |

Vercel'de: Settings → Environment Variables → **Production**. Preview ortamına
eklemeyin — preview deploy'ları gerçek lead tablosuna yazmamalıdır.

## 4. Test

```bash
pnpm build        # DATABASE_URL olmadan da geçmeli
pnpm start
```

Gerçek bir gönderim:

```bash
curl -i -X POST http://localhost:3000/api/lead \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Deneme mesajı","language":"tr","formStartedAt":'"$(( $(date +%s000) - 10000 ))"'}'
```

Beklenen: `200 {"ok":true,"id":"<uuid>"}`.

- `formStartedAt` **10 sn öncesi** olmalı: 3 sn'den hızlı gönderimler bot sayılır
  ve sessizce atılır (yanıt yine `200` görünür — bota ipucu verilmez).
- `DATABASE_URL` yoksa: `503 {"code":"unconfigured"}`. **Bu doğru davranıştır.**

Tarayıcıdan dört sayfanın da denenmesi gerekir: `/teklif-al`,
`/en/start-project`, `/iletisim`, `/en/contact`.

Satırı doğrulayın:

```bash
psql "$DATABASE_URL" -c "select created_at, source_path, language, status, selected_fit_id, left(message,40) from leads order by created_at desc limit 5;"
```

Kontrol edin:

- `status = 'new'`
- `language` doğru (`tr` / `en`)
- `source_path` dört rotadan biri
- Sihirbazdan geldiyse `selected_fit_id`, `selected_situation`,
  `reference_project_slug` dolu
- `device_type` = `mobile` / `tablet` / `desktop` (sunucuda türetilir)
- `country` yerelde **null** (yalnızca hosting başlığı varsa dolar)
- **`ip` sütunu yok** — olmayan sütun sızmaz:

```bash
psql "$DATABASE_URL" -c "select column_name from information_schema.columns where table_name='leads' and column_name ~ 'ip';"
# 0 satır dönmeli
```

### Veritabanı kapalıyken

`DATABASE_URL` değişkenini geçici olarak kaldırıp formu deneyin. Form **sahte
başarı göstermemeli**: mesaj yerinde kalmalı ve e-posta/WhatsApp düğmeleri aynı
metni taşımalıdır. Bu, veritabanının gelir için tek hata noktası olmamasının
tek garantisidir.

## 5. Rate limit

Aynı gönderenden **10 dakikada 5** gönderim. Sayaç `lead_rate_limits`
tablosunda tutulur — serverless'ta bellek içi sayaç işe yaramaz, ardışık iki
istek farklı instance'a düşebilir.

Saklanan şey `sha256(ip + salt)`'tır; **ham IP hiçbir yere yazılmaz**. Limit
mekanizması bozulursa **açık kalır (fail open)**: bozuk bir limitleyici asla
gerçek bir lead'in kaybolma sebebi olmamalıdır — spam, sessizlikten ucuzdur.

## 6. Keepalive (opsiyonel)

Yalnızca **boşta uykuya dalan** bir sağlayıcı kullanıyorsanız gerekir (bazı
ücretsiz katmanlar birkaç gün hareketsizlikten sonra veritabanını askıya alır).
Oradaki hata sinsidir: **veritabanını uyandıran istek, ilk gerçek lead olur** ve
zaman aşımına uğrayabilir.

Her zaman açık bir PostgreSQL (VPS, ücretli katman, yerel Docker) kullanıyorsanız
bu uca hiç dokunmayın.

```bash
curl -H "Authorization: Bearer <CRON_SECRET>" \
  http://localhost:3000/api/cron/db-keepalive
# {"ok":true,"leads":<sayı>}
```

`CRON_SECRET` yoksa uç **kapalı kalır** (503), açık değil: korumasız bir cron
ucu, kotanızı harcamak için bedava bir yoldur. Sayı döner, satır döndürmez.

Vercel Cron ile zamanlamak isterseniz repo köküne `vercel.json` ekleyin — **bu
dosya bilinçli olarak commit edilmedi**; deploy yapılandırması tahminle
değiştirilmez:

```json
{
  "crons": [{ "path": "/api/cron/db-keepalive", "schedule": "0 6 * * *" }]
}
```

## 7. Sonraki faz (33D — admin panel)

Admin paneli **aynı `leads` tablosunu** okuyacak. Yeni tablo gerekmez; admin
kimliği veritabanında değil ortam değişkeninde durur (tek kullanıcı için bir
kimlik tablosu gereksizdir).

## 8. Yayın öncesi kontrol listesi

- [ ] `db/schema.sql` çalıştırıldı; `leads` ve `lead_rate_limits` var
- [ ] `information_schema` sorgusu `leads` üzerinde **ip sütunu bulmuyor**
- [ ] `DATABASE_URL` hosting ortamında **Production** olarak ayarlı (POOLED dize)
- [ ] `LEAD_RATE_LIMIT_SALT` ayarlı
- [ ] Dört sayfadan da gerçek gönderim yapıldı, dördü de tabloya düştü
- [ ] `DATABASE_URL` kaldırıldığında form **sahte başarı göstermiyor**
- [ ] Uyuyan bir sağlayıcı kullanılıyorsa `CRON_SECRET` + `vercel.json` cron eklendi
