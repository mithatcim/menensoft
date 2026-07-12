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
- [ ] **Yönlendirme kararı verildi.** `next.config.ts` içindeki 5 eski
      yönlendirme (`/projects`, `/projects/:slug`, `/services`, `/about`,
      `/contact`) bugün Türkçe sayfalara gidiyor. Site hiç yayınlanmadığı için
      korunacak eski bağlantı yok; bu yollara gelecek tek kitle İngilizce kelime
      deneyen ziyaretçi/crawler. Karar yayından ÖNCE verilmeli: dizine
      girdikten sonra hedef değiştirmek yönlendirme zinciri üretir.
- [ ] **Build guard kararı verildi.** Yayında `NEXT_PUBLIC_SITE_URL` unutulursa
      build sessizce localhost ile geçer. Vercel'e özel bir guard eklemek
      (`process.env.VERCEL` varsa değişken yoksa build'i düşür) opsiyoneldir;
      eklenmediyse §5 doğrulaması bunu yakalamak zorundadır.

## 2. Ortam değişkeni

Tek zorunlu değişken:

```
NEXT_PUBLIC_SITE_URL=https://<birincil-domain>   # sonda / OLMADAN
```

- Vercel'de **Production** ortamına eklenir; build ANINDA okunur (`NEXT_PUBLIC_*`
  değeri derlenmiş çıktıya gömülür — çalışma anında okunmaz).
- Domain sonradan değişirse "Redeploy without build cache" gerekir.
- `.env.example` şablondur; gerçek `.env*` dosyaları commit edilmez.
- **Şema zorunlu.** `https://` olmadan yazılan değer `new URL()` içinde
  patlar ve build kök layout'ta kırılır. `menensoft.com` geçersiz,
  `https://menensoft.com` geçerli.
- Sondaki `/` kod tarafında kırpılır (`replace(/\/+$/, "")`), yani zararsız —
  ama yazmayın.

Değişken yoksa (bugünkü durum) kod `http://localhost:3000` fallback'ine düşer.
Bunun etki alanı **tek bir etiket değil**; localhost bu üretimlere sızar:

| Üretim | Kaynak |
| --- | --- |
| `<link rel="canonical">`, `og:url` | `metadataBase` (iki kök layout) |
| hreflang üçlüsü (tr / en / x-default) | `src/lib/seo.ts` |
| `/sitemap.xml` — 58 URL'nin tamamı | `src/app/sitemap.ts` |
| `/robots.txt` `Host:` + `Sitemap:` | `src/app/robots.ts` |
| JSON-LD `@id` ve `url` alanları (organization, website, founder, breadcrumb, proje) | `src/lib/schema.ts` |

Yani değişkeni ayarlamamak kozmetik değil: sitemap ve JSON-LD kimlikleri dahil
tüm mutlak URL yüzeyi yanlış olur.

## 3. Vercel proje ayarları

- Framework: Next.js (otomatik algılanır), kök dizin repo kökü.
- Paket yöneticisi: pnpm (`pnpm-lock.yaml` + `packageManager` alanından).
- Node: proje `>=20.9` ister; Vercel'de **22.x LTS** seçin.
- Domains: apex + www eklenir, birincil seçilir; `NEXT_PUBLIC_SITE_URL`
  birincil ile birebir aynı olmalıdır.

## 4. Build beklentisi

`pnpm build` → TypeScript temiz, sıfır uyarı, **58 kanonik sayfa** (29 TR +
29 EN) + metadata rotaları. Rota tablosunda **2 dinamik (ƒ) rota normaldir**:
`(tr)/[...rest]` ve `en/[...rest]` — iki kök layout'lu yapıda markalı 404'ü
sağlayan yakala-hepsi rotalarıdır; Vercel'de sorunsuz çalışır. Yeni bir
uyarı = regresyon.

## 5. Yayın sonrası doğrulama (aynı gün)

Tek komutla site denetimi:

```
BASE=https://<domain> pnpm audit:site
BASE=https://<domain> pnpm audit:browser   # yerel makineden, opsiyonel
```

**Önce şunu çalıştırın** — `NEXT_PUBLIC_SITE_URL` unutulduysa tek komutla belli
olur. Beklenen çıktı: her satır `0`. Sıfırdan büyük tek bir sayı bile
"değişken build'e girmemiş" demektir:

```
curl -s https://<domain>/            | grep -c localhost   # canonical + og:url + JSON-LD
curl -s https://<domain>/sitemap.xml | grep -c localhost   # 58 URL
curl -s https://<domain>/robots.txt  | grep -c localhost   # Host + Sitemap
```

Ek elle kontroller:

- [ ] `view-source` ile canonical'lar gerçek domainde (ana sayfa + 1 proje +
      1 sektör + 1 sistem).
- [ ] `/sitemap.xml` **58 URL** (29 TR + 29 EN), hepsi gerçek domainde.
- [ ] `/robots.txt` Sitemap/Host satırları gerçek domainde.
- [ ] `/opengraph-image` ve `/twitter-image` 200; bir sosyal kart
      doğrulayıcısında önizleme kontrolü.
- [ ] JSON-LD: `/`, `/en`, `/sss` ve `/en/faq` Google Rich Results
      testinden geçer (FAQPage yalnızca /sss ve /en/faq'ta).
- [ ] Yönlendirmeler: `/projects`, `/services`, `/about`, `/contact` → 308.
- [ ] Metadata rotaları: favicon.ico, icon, apple-icon, og/twitter image,
      robots.txt, sitemap.xml, manifest.webmanifest → 200.
- [ ] HTTPS sertifikası apex + www'de geçerli; karışık içerik yok.

İki dilli kontroller:

- [ ] `/en` rotaları canlıda 200 (en azından /en, /en/projects,
      /en/start-project, /en/faq elle gezilir).
- [ ] hreflang şu sayfalarda karşılıklı ve gerçek domainde: `/`, `/en`,
      `/projeler/ecommerce-cms`, `/en/projects/ecommerce-cms`,
      `/teklif-al`, `/en/start-project` (tr + en + x-default).
- [ ] Dil değiştirici canlıda eşdeğer sayfaya gidiyor (TR proje →
      EN proje, EN sistem → TR sistem örnekleriyle).
- [ ] `/en` sayfaları Türkçeye YÖNLENMİYOR (200 dönmeli, 308 değil).

## 6. Gerçek cihaz kontrolleri

- [ ] Android Chrome + iPhone Safari: mobil menü, dokunma hedefleri
      (TR ve EN menü ayrı ayrı).
- [ ] `mailto:` bağlantısı Türkçe karakterli gövdeyle doğru açılıyor.
- [ ] `/en/start-project` sihirbazı gerçek cihazda İngilizce konu
      ("Menensoft project inquiry") ve İngilizce gövdeyle açılıyor;
      WhatsApp önyüklemesi İngilizce.
- [ ] `wa.me` bağlantısı önceden doldurulmuş metinle WhatsApp'ı açıyor.
- [ ] Sabitlenmiş sahneler (ana sayfa, /surec, /en, /en/process) mobilde
      yığın düzene düşüyor.

## 7. Arama motoru kaydı

- [ ] Search Console'da mülk doğrulama.
- [ ] `/sitemap.xml` gönderimi.
- [ ] Birkaç gün sonra kapsam raporunda 58 sayfanın (Türkçe VE İngilizce
      URL'lerin) durumunu kontrol et; /en sayfalarının "alternate page with
      canonical" olarak değil, kendi başına dizinlendiğini doğrula.

## 8. Yayından önce DOKUNMA

- `src/content/site.ts` içindeki `NEXT_PUBLIC_SITE_URL` fallback mantığı.
- İletişim değerleri: mithat.menen@gmail.com, wa.me/905303115870,
  github.com/mithatcim.
- 29 rotalık envanter (`src/lib/routes.ts`), yönlendirme haritası, JSON-LD
  üreticileri, favicon seti.
- Yeni bağımlılık, analitik/izleme scripti, i18n altyapısı eklenmez.
