# SEO & GEO — yayın kontrol listesi

Site canlı: **https://menensoft.com**

Bu dosya, arama motorlarına ve AI cevap motorlarına kaydolurken yapılacakları
tarif eder. **Hiçbir doğrulama kodu koda gömülmemiştir** — token'ları siz alır,
siz girersiniz. Sahte doğrulama dosyası da yoktur.

---

## 1. Google Search Console

1. https://search.google.com/search-console → **Mülk ekle**
2. **Domain** tipini seçin (`menensoft.com`) — URL öneki değil. Domain mülkü
   apex, www ve http/https'in hepsini tek seferde kapsar.
3. Google bir **TXT kaydı** verir. Bunu **GüzelHosting DNS panelinden** ekleyin:
   - Tip: `TXT`, Ad: `@`, Değer: Google'ın verdiği satır
   - Mevcut `A @ 216.198.79.1` kaydına **dokunmayın**
4. **Doğrula**. DNS yayılması birkaç dakika sürebilir.

### Sitemap gönderin

Search Console → **Sitemaps** → şunu ekleyin:

```
sitemap.xml
```

(Tam URL: `https://menensoft.com/sitemap.xml`)

### İndeksleme isteyin

Search Console → **URL denetimi** → şu sayfaları tek tek girip
**"İndekslemeyi iste"** deyin. Hepsini istemeyin — en önemli olanları:

- `https://menensoft.com/`
- `https://menensoft.com/cozumler`
- `https://menensoft.com/projeler`
- `https://menensoft.com/e-ticaret-sitesi`
- `https://menensoft.com/qr-menu-sistemi`
- `https://menensoft.com/ozel-yazilim-gelistirme`

Gerisi sitemap üzerinden kendiliğinden taranır.

---

## 2. Bing Webmaster Tools

1. https://www.bing.com/webmasters → **Site ekle**
2. **"Google Search Console'dan içe aktar"** seçeneğini kullanın — en hızlısı
   budur, ayrıca DNS'e ikinci bir TXT kaydı eklemekten kurtarır.
3. Sitemap otomatik gelir; gelmezse `https://menensoft.com/sitemap.xml` ekleyin.

Bing'i atlamayın: **ChatGPT'nin web araması Bing altyapısını kullanır.** Bing'de
görünmüyorsanız, orada da görünmezsiniz.

### IndexNow (opsiyonel)

Bing Webmaster → **IndexNow**. İçerik sık değişiyorsa değerli; bu site için
şimdilik **gerekli değil** ve eklenmedi. Panelden proje yayınladığınızda sayfa
zaten anında canlıya çıkıyor; Bing bir sonraki taramada görür.

---

## 3. AI cevap motorları (GEO)

Kod tarafında hazır olan:

- **`/llms.txt`** — https://menensoft.com/llms.txt
  Menensoft'un ne olduğunu, ne kurduğunu, kime hizmet ettiğini ve nasıl
  başlanacağını düz metin olarak anlatır. Proje listesi **veritabanından**
  okunur: arşivlediğiniz proje buradan da kendiliğinden düşer.
- **FAQPage şeması** — arama sayfalarındaki SSS blokları. AI motorları bu
  soru-cevap formatını doğrudan alıntılar.
- **Service, HowTo, ContactPoint, BreadcrumbList, CollectionPage** şemaları.

Yapılacak bir şey yok — bu yüzeyler tarandıkça çalışır.

---

## 4. Yayın sonrası ne izlenir

**İlk 2 hafta:** hiçbir şey. Yeni bir alan adının indekslenmesi zaman alır;
her gün Search Console'a bakmak yalnızca moral bozar.

**2–8 hafta arası:**

| Nerede | Neye bakılır |
| --- | --- |
| Search Console → Sayfalar | Kaç sayfa indekslendi? **74 URL** bekleniyor (30 TR + 30 EN statik/detay + 7 arama sayfası × 2 dil, 5 proje × 2 dil dahil) |
| Search Console → Sorgular | Hangi aramalarla geliniyor? Beklenmedik bir sorgu = yeni bir sayfa fikri |
| Search Console → Deneyim | Core Web Vitals kırmızı mı? |
| `/admin/analytics` | Hangi sayfa gerçekten ziyaret alıyor |
| `/admin/leads` | **Tek gerçek metrik bu.** Trafik değil, gelen talep. |

**Aylık:** hangi arama sayfası hiç talep getirmedi? Getirmiyorsa ya sorgu yanlış
ya sayfa. İkisini de düzeltmek, yeni sayfa eklemekten iyidir.

---

## 5. YAPILMAYACAKLAR

- **Sahte doğrulama dosyası/token eklemeyin.** Google bunu fark eder.
- **Anahtar kelime doldurmayın.** Sayfa başına bir konu; aynı konu için ikinci
  bir sayfa açmak ikisini birden zayıflatır (keyword cannibalization).
- **Uydurma yorum/puan/referans eklemeyin.** `AggregateRating` ve `Review`
  şemaları bilinçli olarak **eklenmedi** — arkasında gerçek müşteri yorumu
  olmadan eklemek, Google'ın manuel işlem uyguladığı ihlaldir.
- **Görünmeyen içeriği şemaya koymayın.** FAQPage yalnızca sayfada görünen
  soruları içerir. Bu kural kodda uygulanır, iyi niyete bırakılmaz.
- **Google Analytics / Meta Pixel eklemeyin** — çerez ve gizlilik sayfası
  güncellenmeden olmaz. Bkz. bölüm 6.
- **`NEXT_PUBLIC_SITE_URL`'i değiştirmeyin.** Build'e gömülür; değişirse
  **build cache olmadan** yeniden deploy gerekir, yoksa tüm canonical'lar eski
  kalır.

---

## 6. Ölçüm: bugün ne var, ne eklenebilir

**Bugün çalışan (çerezsiz, kendi altyapımız):**

- Sayfa görüntüleme, oturum, cihaz, ülke, süre → `/admin/analytics`
- **Çerez yok. localStorage kimliği yok. Ham IP saklanmıyor. Üçüncü taraf yok.**
- Ziyaretçi kimliği sunucuda türetilir ve **tuz her gün döner** — günler arası
  takip teknik olarak mümkün değildir.
- Form gönderimi, aynı günkü anonim oturumla sunucu tarafında eşleştirilir:
  "hangi sayfa gerçekten iş getiriyor" sorusu cevaplanabilir.

**Önerilen dönüşüm olayları** (hâlihazırda kaydediliyor): `page_view`,
`cta_click`, `proof_click`, `email_click`, `whatsapp_click`, `form_submit`,
`language_switch`.

**İleride eklenebilecekler:**

| Araç | Şartı |
| --- | --- |
| Google Search Console | **Şartsız.** Çerez koymaz, sadece Google'ın sizi nasıl gördüğünü gösterir. Hemen ekleyin. |
| Bing Webmaster Tools | **Şartsız.** Aynı sebep + ChatGPT araması. |
| Microsoft Clarity | Çerez kullanır → **gizlilik sayfası güncellenmeden eklenmez** |
| Google Analytics 4 | Çerez + üçüncü taraf veri aktarımı → gizlilik sayfası **ve** çerez onayı gerekir. Bugünkü "çerez banner'ı yok" konumu bozulur. |

Son ikisi bir **karar**dır, bir eklenti değil. Gizlilik sayfası bugün "çerez
kullanmıyoruz" diyor; bir izleyici eklemek o cümleyi yalana çevirir ve
sayfadaki diğer her iddianın değerini düşürür.
