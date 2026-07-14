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

## 7. Analitik (Phase 33E)

Birinci taraf, **çerezsiz**. Üçüncü taraf script yok, Google Analytics yok,
Plausible/Fathom yok.

### Neden çerez banner'ı yok

Ziyaretçi kimliği **tarayıcıda değil, sunucuda** türetilir:

```
visitor_key = sha256(ANALYTICS_SALT + UTC-tarih + ip + user-agent + "menensoft")
```

- **IP yalnızca bellekte** kullanılır, hash'i hesaplamak için. Hiçbir tabloda IP
  sütunu **yoktur** — olmayan sütun sızmaz.
- **Tuz her gün döner**: aynı kişi yarın farklı bir anahtar alır. Günler
  boyunca izleme teknik olarak mümkün değildir.
- Ziyaretçinin cihazına **hiçbir şey yazılmaz**: çerez yok, localStorage yok,
  parmak izi yok.

Cihazda hiçbir tanımlayıcı saklanmadığı için çerez onayı gerekmez. Bedeli:
"dünkü ziyaretçi bugün döndü mü?" sorusunu **yanıtlayamayız**. Bu iş için o soru
gerekli değil; bir banner'ın maliyeti ise gerçek.

> Bu hukuki tavsiye değildir. AB trafiği ticari olarak önemliyse bir hukukçuya
> danışın.

### Saklanmayanlar (kasıtlı, sütun bile yok)

- ham IP
- tam user-agent (yalnızca `mobile/tablet/desktop/unknown` türetilir)
- **tam referrer URL** — yalnızca HOST saklanır. Tam URL, ziyaretçinin arama
  sorgusunu ya da özel bir yolunu taşıyabilir. Bu bir söz değil, bir **CHECK
  kısıtı**: veritabanı içinde `/ ? #` geçen bir referrer'ı reddeder.
- e-posta, telefon, mesaj — olay metadata'sı kapalı bir anahtar listesiyle
  sınırlıdır.

### Tarayıcı depolaması — analitik DEĞİL

Analitik hiçbir şey yazmaz. Tarayıcıda tutulan tek işlevsel değer, Phase 33F
dil öneri banner'ının tercihidir (): ziyaretçi
"Kapat" ya da dil düğmesine bastığında yazılır, yalnızca aynı öneriyi tekrar
göstermemek için. Kimlik değildir, sunucuya gönderilmez, analitikte
kullanılmaz. Bu yüzden çerez onay penceresi hâlâ gerekmez.

### Tarayıcı depolaması — analitik DEĞİL (Phase 33F)

Analitik ziyaretçinin cihazına hiçbir şey yazmaz. Tarayıcıda tutulan tek
işlevsel değer, dil öneri banner'ının tercihidir: `menensoft_language_hint`.
Yalnızca ziyaretçi "Kapat"a ya da dil düğmesine bastığında yazılır ve tek işi
aynı öneriyi tekrar göstermemektir.

Kimlik değildir, sunucuya gönderilmez, analitikte kullanılmaz. Bu yüzden çerez
onay penceresi hâlâ gerekmez.

Dil banner'ı **hiçbir yönlendirme yapmaz**: middleware yok, IP/ülke tespiti yok.
Tek sinyal `navigator.languages`. Sebep: ABD IP'lerinden tarayan Googlebot
"/" → "/en" yönlendirmesi görürse Türkçe ana sayfa Türkçe dizinden düşebilir.

### Lead ↔ oturum eşleştirmesi (Phase 36A)

Bir form gönderildiğinde sunucu, **aynı günlük visitor_key'i yeniden hesaplayarak**
o ziyaretçinin canlı oturumunu bulur ve `leads.session_id` alanına yazar. Böylece
"hangi sayfalar gerçekten iş getiriyor?" sorusu yanıtlanabilir.

Tarayıcı bu işin hiçbir yerinde değildir ve olamaz: bir kimliği yoktur, hiç
olmadı, istese de gönderemez. Çerez yok, localStorage yok, ham IP yok — adres
yalnızca tek bir hash süresince bellektedir. Tuz her gün döndüğü için eşleşme
**yalnızca aynı gün** mümkündür.

Eşleşme bulunamazsa (analitik kapalı, DNT/GPC, oturum penceresi kapanmış) lead
yine kaydedilir; `session_id` boş kalır. **Eşleştirme hatası asla bir lead'e mal
olmaz.**

Bu, gizlilik açısından bir adım ileridir ve /gizlilik + /en/privacy sayfaları bunu
**açıkça** yazar. Sessizce yapılmadı.

### DNT / Sec-GPC

`DNT: 1` ya da `Sec-GPC: 1` gönderen ziyaretçiler **kaydedilmez**. Botlar da
yazma anında elenir (sonradan temizlemek mümkün değildir). Yani paneldeki
sayılar gerçek trafiğin bir **alt kümesidir** — panel bunu açıkça söyler.

### Ortam değişkeni

```
ANALYTICS_SALT=<uzun rastgele dize>
```

Üretin:

```bash
node -e "console.log('ANALYTICS_SALT=' + require('node:crypto').randomBytes(32).toString('hex'))"
```

**Yoksa analitik KAPALIDIR** (`/api/e` → `{ok:true, skipped:"unconfigured"}`).
Bu bilinçli: tuzsuz bir IP+UA hash'i pratikte geri döndürülebilir — adres uzayı
kaba kuvvetle taranacak kadar küçüktür. "Tuz yok" **analitik yok** demektir,
"zayıf anahtarla analitik" değil.

Tuzu değiştirirseniz geçmiş anahtarlarla bağ kopar (zaten günlük kopuyor).

### Rotalar

- `POST /api/e` — olay toplama. **Yalnızca yazar**; GET yoktur, veri döndürmez.
  Hiçbir hata sayfayı bozmaz: her başarısızlık `200 {ok, skipped}` döner.
- `/admin/analytics` — panel (admin girişi gerekir).
- `/admin/sessions/<id>` — oturum yolu.

### Test

Şemayı uygulayın (yeni tablolar idempotent eklenir):

```bash
docker exec -i websitem-pg psql -U menensoft -d menensoft < db/schema.sql
```

`ANALYTICS_SALT` ayarlayın, `pnpm build && pnpm start`, siteyi **gerçek bir
tarayıcıda** gezin (headless/bot user-agent'ları bilinçli olarak elenir), sonra:

```bash
psql "$DATABASE_URL" -c "select event_type, path, metadata from analytics_events order by created_at desc limit 10;"
psql "$DATABASE_URL" -c "select first_path, last_path, pageview_count, duration_seconds from visitor_sessions order by last_seen_at desc limit 5;"
```

IP sütunu olmadığını doğrulayın:

```bash
psql "$DATABASE_URL" -c "select column_name from information_schema.columns where table_name in ('visitor_sessions','analytics_events') and column_name ~ 'ip|fingerprint|user_agent';"
# 0 satır
```

### Saklama süresi (öneri: 12 ay)

Zamanlanmış silme **kasıtlı olarak eklenmedi** — veri silen bir cron'u yanlış
kurmak, hiç kurmamaktan kötüdür. Hazır olduğunuzda:

```sql
delete from analytics_events where created_at   < now() - interval '12 months';
delete from visitor_sessions where last_seen_at < now() - interval '12 months';
```

`leads` bir iş kaydıdır; o silinmez.

## 8. Sonraki faz (33D — admin panel)

Admin paneli **aynı `leads` tablosunu** okuyacak. Yeni tablo gerekmez; admin
kimliği veritabanında değil ortam değişkeninde durur (tek kullanıcı için bir
kimlik tablosu gereksizdir).

## 9. Proje CMS tabloları (Phase 38A — yalnızca hazırlık)

`projects`, `project_translations`, `project_slug_redirects` tabloları artık
şemada var. **Herkese açık proje sayfaları bunları HENÜZ okumuyor.**

`/projeler`, `/projeler/[slug]`, `/en/projects`, `/en/projects/[slug]` hâlâ
`src/content/projects.ts` ve `src/content/en/projects.ts` dosyalarından okur ve
38C'ye kadar öyle kalacak. Bu fazın tek amacı, veritabanı içeriğinin **yayına
çıkmadan önce** dosyalarla birebir aynı olduğunun kanıtlanabilmesidir.

**Typed dosyaları silmeyin.** Onlar hâlâ tek gerçek kaynak ve aynı zamanda geri
dönüş yolu.

```bash
pnpm cms:seed      # typed dosyaları veritabanına birebir kopyalar (idempotent)
pnpm cms:verify    # veritabanı ↔ dosya eşitliğini alan alan kanıtlar
```

Seed hiçbir metni düzeltmez, çevirmez, "iyileştirmez": bunu yapsaydı kanıt daha
çalıştırılamadan yok olurdu. Tekrar çalıştırmak güvenlidir — satır çoğaltmaz,
`published_at` damgasını yeniden basmaz ve bozulmuş bir satırı dosyadaki hâline
geri getirir.

`cms:verify` **render girdisini** karşılaştırır, HTML'i değil: proje sayfaları
`Project` nesnesinin saf birer fonksiyonudur, dolayısıyla nesne birebir aynıysa
sayfa da birebir aynıdır. Alan kaybını (`statusNote` yok olmuş), alan uydurmayı
ve dizi sırası değişimini yakalar — bilerek bozulmuş bir satırla test edilmiştir:
kanıt, başarısız **olabildiği** için bir kanıttır.

Bu scriptler Node 24 ister (yerleşik TypeScript tip soyma + `--env-file`).

**38B notu.** Panelden proje oluşturulabildiği için veritabanı artık typed
dosyaların bir **üst kümesi** olabilir. `cms:verify` bunu bilir: panelden
eklenen projeleri ayrı satırda bildirir ve dışarıda bırakır. Sorduğu soru
"veritabanı donduruldu mu" değil, **"dosyalardaki içerik kayıpsız duruyor mu"**.

`project_translations` uzunluk kısıtları 38B'de **tavan-only** hâline getirildi
(`length(name) <= 120`, alt sınır yok). Sebep: taslak. Yarım yazılmış bir
İngilizce çeviri meşru bir durumdur — sahibi bir başlık yazar, kaydeder, ertesi
gün döner — ve alt sınırlı bir kısıt bu kaydı reddedip işi çöpe atardı.
Tamlık bir **yayın** kuralıdır, depolama kuralı değil; publish action'ında
sunucu tarafında zorlanır.

## 10. Yayın öncesi kontrol listesi

- [ ] `db/schema.sql` çalıştırıldı; `leads` ve `lead_rate_limits` var
- [ ] `information_schema` sorgusu `leads` üzerinde **ip sütunu bulmuyor**
- [ ] `DATABASE_URL` hosting ortamında **Production** olarak ayarlı (POOLED dize)
- [ ] `LEAD_RATE_LIMIT_SALT` ayarlı
- [ ] Dört sayfadan da gerçek gönderim yapıldı, dördü de tabloya düştü
- [ ] `DATABASE_URL` kaldırıldığında form **sahte başarı göstermiyor**
- [ ] Uyuyan bir sağlayıcı kullanılıyorsa `CRON_SECRET` + `vercel.json` cron eklendi
