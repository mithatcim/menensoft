# Menensoft — Yayın Kontrol Listesi

Bu dosya, gerçek alan adı hazır olduğunda güvenli yayına çıkmak için gereken
adımları tanımlar. Alan adı belli olana kadar hiçbir env dosyasına gerçek ya
da uydurma domain YAZMAYIN — kod, `NEXT_PUBLIC_SITE_URL` yokken bilinçli
olarak localhost'a düşer.

## 1. Yayın öncesi kararlar

- [ ] Alan adı alındı; birincil biçim seçildi (apex mi `www` mı).
- [ ] Görünür Türkçe kopya için son bir ana-dil okuması yapıldı.
- [ ] Proje ekran görüntüleri stratejisi netleşti (rezerve çerçeveler bilinçli
      olarak boş — gerçek görseller ayrı bir fazda eklenecek).

## 2. Ortam değişkeni

Tek zorunlu değişken:

```
NEXT_PUBLIC_SITE_URL=https://<birincil-domain>   # sonda / OLMADAN
```

- Vercel'de **Production** ortamına eklenir; build ANINDA okunur.
- Domain sonradan değişirse "Redeploy without build cache" gerekir.
- `.env.example` şablondur; gerçek `.env*` dosyaları commit edilmez.

## 3. Vercel proje ayarları

- Framework: Next.js (otomatik algılanır), kök dizin repo kökü.
- Paket yöneticisi: pnpm (`pnpm-lock.yaml` + `packageManager` alanından).
- Node: proje `>=20.9` ister; Vercel'de **22.x LTS** seçin.
- Domains: apex + www eklenir, birincil seçilir; `NEXT_PUBLIC_SITE_URL`
  birincil ile birebir aynı olmalıdır.

## 4. Build beklentisi

`pnpm build` → TypeScript temiz, sıfır uyarı, 29 kanonik sayfa + metadata
rotaları (toplam ~44 statik rota). Yeni bir uyarı = regresyon.

## 5. Yayın sonrası doğrulama (aynı gün)

Tek komutla site denetimi:

```
BASE=https://<domain> pnpm audit:site
BASE=https://<domain> pnpm audit:browser   # yerel makineden, opsiyonel
```

Ek elle kontroller:

- [ ] `view-source` ile canonical'lar gerçek domainde (ana sayfa + 1 proje +
      1 sektör + 1 sistem).
- [ ] `/sitemap.xml` 29 URL, hepsi gerçek domainde.
- [ ] `/robots.txt` Sitemap/Host satırları gerçek domainde.
- [ ] `/opengraph-image` ve `/twitter-image` 200; bir sosyal kart
      doğrulayıcısında önizleme kontrolü.
- [ ] JSON-LD: `/`, `/sss` ve bir sektör sayfası Google Rich Results
      testinden geçer (FAQPage yalnızca /sss'te).
- [ ] Yönlendirmeler: `/projects`, `/services`, `/about`, `/contact` → 308.
- [ ] Metadata rotaları: favicon.ico, icon, apple-icon, og/twitter image,
      robots.txt, sitemap.xml, manifest.webmanifest → 200.
- [ ] HTTPS sertifikası apex + www'de geçerli; karışık içerik yok.

## 6. Gerçek cihaz kontrolleri

- [ ] Android Chrome + iPhone Safari: mobil menü, dokunma hedefleri.
- [ ] `mailto:` bağlantısı Türkçe karakterli gövdeyle doğru açılıyor.
- [ ] `wa.me` bağlantısı önceden doldurulmuş metinle WhatsApp'ı açıyor.
- [ ] Sabitlenmiş sahneler (ana sayfa, /surec) mobilde yığın düzene düşüyor.

## 7. Arama motoru kaydı

- [ ] Search Console'da mülk doğrulama.
- [ ] `/sitemap.xml` gönderimi.
- [ ] Birkaç gün sonra kapsam raporunda 29 sayfanın durumunu kontrol et.

## 8. Yayından önce DOKUNMA

- `src/content/site.ts` içindeki `NEXT_PUBLIC_SITE_URL` fallback mantığı.
- İletişim değerleri: mithat.menen@gmail.com, wa.me/905303115870,
  github.com/mithatcim.
- 29 rotalık envanter (`src/lib/routes.ts`), yönlendirme haritası, JSON-LD
  üreticileri, favicon seti.
- Yeni bağımlılık, analitik/izleme scripti, i18n altyapısı eklenmez.
