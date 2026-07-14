# Yönetim paneli — kurulum (Phase 33D)

`/admin` altındaki panel, form gönderimlerini (`leads`) okumak ve durumlarını
güncellemek içindir. Tek kullanıcı vardır: site sahibi.

**Kayıt yoktur. Parola sıfırlama yoktur. Davet yoktur.** Bunlar bu projede olmayan
bir sorunun çözümleridir ve her biri kilitlenmesi unutulabilecek bir kapıdır.
Kimlik bilgisi ortam değişkeninde durur.

## 1. Gerekli ortam değişkenleri

| Değişken | Ne için |
| --- | --- |
| `ADMIN_EMAIL` | Giriş yapacak tek e-posta. |
| `ADMIN_PASSWORD_HASH` | Parolanın scrypt hash'i. Parolanın kendisi hiçbir yere yazılmaz. |
| `ADMIN_SESSION_SECRET` | Oturum çerezini imzalar. Uzun ve rastgele. |
| `DATABASE_URL` | Panel veritabanı olmadan çalışmaz (POSTGRES_SETUP.md). |

Hiçbiri `NEXT_PUBLIC_` öneki almaz. Öneki alan her şey tarayıcıya gömülür.

Üçü de eksikken site ve build sorunsuz çalışır: `/admin/login` "kurulum gerekli"
ekranı gösterir, hiçbir veri açığa çıkmaz.

## 2. Parola hash'i üretin

```bash
node scripts/hash-admin-password.mjs
```

Parolayı sorar (ekrana yazmaz, geçmişe düşmez), doğrulatır ve tek satırlık hash'i
basar. En az 12 karakter ister — bu, internete açık tek giriş noktanızdır.

Çıktı şu biçimdedir:

```
ADMIN_PASSWORD_HASH=scrypt:16384:8:1:<salt>:<hash>
```

> **İki nokta, dolar değil — ve bu kozmetik değildir.** Yaygın PHC biçimi
> (`scrypt$16384$8$...`) bu değer bir `.env` dosyasında yaşadığı için
> KULLANILAMAZ: dotenv değişken genişletmesi yapar ve `$16384` ifadesini "`1`
> adlı değişken + `6384` metni" olarak okur. Hash uygulamaya `scrypt6384` olarak
> ulaşır, hiçbir hata vermez, doğru parola sessizce reddedilir. Biçimi dolarlı
> hâline "düzeltmeyin".

## 3. Oturum sırrı üretin

```bash
node -e "console.log('ADMIN_SESSION_SECRET=' + require('node:crypto').randomBytes(32).toString('hex'))"
```

Bu değeri değiştirmek, açık olan tüm oturumları anında geçersiz kılar —
çerezinizin çalındığından şüphelenirseniz yapılacak ilk şey budur.

## 4. Yerelde ayarlayın

`.env.local` (git tarafından yok sayılır — asla commit edilmez):

```
DATABASE_URL=postgresql://menensoft:devpass@localhost:5433/menensoft
ADMIN_EMAIL=siz@ornek.com
ADMIN_PASSWORD_HASH=scrypt:16384:8:1:...
ADMIN_SESSION_SECRET=...
```

Yerel PostgreSQL (Docker konteyneri `websitem-pg`, port **5433**) kurulumu
POSTGRES_SETUP.md bölüm 1'dedir. Şemayı çalıştırmayı unutmayın — 33D
`admin_login_attempts` tablosunu ekledi:

```bash
docker exec -i websitem-pg psql -U menensoft -d menensoft < db/schema.sql
```

(Idempotent: tekrar çalıştırmak güvenlidir.)

## 5. Hosting ortamında ayarlayın

Vercel → Settings → Environment Variables → **Production**. Dört değişkenin
dördü de. Preview ortamına eklemeyin: preview deploy'ları gerçek lead tablosuna
erişmemelidir.

## 6. Giriş / çıkış

- Giriş: `/admin/login`
- Panel: `/admin` (özet), `/admin/leads` (liste), `/admin/leads/<id>` (detay)
- Çıkış: paneldeki **Çıkış** düğmesi — oturum çerezini siler.

Oturum **7 gün** sürer. Çerez `httpOnly` (JavaScript okuyamaz), `SameSite=Lax`
(CSRF), üretimde `Secure` (yalnızca HTTPS) ve **yalnızca `/admin` yoluna**
kapsanmıştır — herkese açık sayfalar bu çerezi hiç taşımaz.

## 7. Kaba kuvvet koruması

Aynı gönderenden **10 dakikada 5 başarısız deneme**. Sayaç
`admin_login_attempts` tablosundadır; saklanan şey `sha256(ip + salt)`'tır, ham
IP değil.

Bu limit, lead limitinin **tersine, FAIL CLOSED çalışır**: veritabanı
erişilemezse giriş reddedilir. Bozuk bir limitleyici, korumasız bir giriş
formundan iyidir — kaybedilen tek şey sahibin birkaç dakikası olur, müşteri
listesi değil.

Başarılı bir giriş sayacı sıfırlar; birkaç yanlış deneme sizi kilitlemez.

## 8. Güvenlik notları

- **Güçlü parola kullanın.** Tek savunma hattı budur; script 12 karakterin altını
  kabul etmez ama 12 karakter alt sınırdır, hedef değil.
- **Admin sırlarını commit etmeyin.** `.env*` git tarafından yok sayılır;
  `.env.example` yalnızca yorumlu şablondur.
- Panel `noindex` işaretlidir ve `robots.txt` `/admin` yolunu yasaklar. Bunlar
  koruma değildir — koruma oturum kontrolüdür — ama müşteri listesinin yalnızca
  "bağlantısız" olması ile "arama motorlarına yasak" olması farklı şeylerdir.
- Panele herkese açık sitede hiçbir yerden bağlantı verilmez. Adresi siz bilirsiniz.
- Tüm sorgular parametrelidir; filtre/arama kutusuna yazılan hiçbir şey SQL'e
  metin olarak girmez.

## 9. CRM akışı (Phase 36A)

Panel bir gelen kutusu değil, çalışma aracıdır.

**Satış hattı (8 durum):** Yeni → Okundu → İletişime geçildi → Nitelikli →
Teklif gönderildi → Kazanıldı / Kaybedildi. Arşiv bir satış aşaması değil,
depolamadır.

> Aşamalar **atlanabilir**. Bir lead'i zorla "Nitelikli" ve "Teklif gönderildi"
> aşamalarından geçirmek, tam olarak o aşamaların güncellenmeyi bırakmasına yol
> açar — ve güncellenmeyen bir aşama boş değil, **YANLIŞ**tır. Üstüne kurulan her
> dönüşüm sayısı da yanlış olur. Bu yüzden dönüşüm hesapları yalnızca
> Kazanıldı/Kaybedildi üzerinden yapılır.

**Otomatik olan her şey otomatiktir:**

- Lead'i açmak onu okundu yapar (`read_at` damgalanır). Ayrı bir "okundu işaretle"
  düğmesi, kimsenin basmadığı bir düğme olurdu — ve o zaman `read_at` yalan söylerdi.
- Durum değişikliği ima ettiği tarihleri damgalar ve zaman çizelgesine kendini yazar.
- "Telefon yapıldı" tek tıklamadır: tarihi damgalar, aşamayı ilerletir, kaydı düşer.
- Kazanıldı/Kaybedildi/Arşiv hatırlatmayı **temizler** — kapanmış bir lead'de duran
  hatırlatma gürültüdür, ve gürültü bir hatırlatma listesinin güvenilmez olma yoludur.

**Bugün ne yapmalı (dashboard):** üç kuyruk — yanıt bekleyenler, hatırlatması
bugün/gecikmiş olanlar, iletişim kurulup 5+ gündür sessiz kalanlar.

**Zaman çizelgesi:** eklemeli. Not, telefon, WhatsApp, e-posta, durum değişimi,
hatırlatma. Görüşmeden sonra buraya yazın; aklınızda tutmayın.

**CSV dışa aktarma:** `/admin/leads` sağ üstteki CSV düğmesi. Yalnızca giriş
yapmış sahibe açıktır (yetkisiz istek **404** alır, 401 değil — yabancı bir şey
öğrenmez). Formül enjeksiyonuna karşı kaçışlanır (`=`, `+`, `-`, `@` ile başlayan
bir isim Excel'de çalıştırılamaz) ve UTF-8 BOM taşır (yoksa Excel Türkçe
karakterleri bozar). Oturum yolu ve user-agent **dışa aktarılmaz**.

## 10. Proje CMS (Phase 38B)

`/admin/projects` — projeleri panelden yönetin. **Phase 38C'den beri buradaki
her değişiklik herkese açık siteye çıkar.** Kaydettiğinizde ilgili sayfalar ve
sitemap yeniden üretilir; ayrı bir deploy gerekmez.

- **Yayınla** → sayfa canlıya çıkar, sitemap'e 2 URL eklenir (TR + EN).
- **Arşivle** → sayfa 404 olur, sitemap'ten 2 URL düşer, proje artık `?proje=`
  referansı olarak da kabul edilmez. İçerik durur; geri alınabilir.
- **Slug değişirse** eski adres kalıcı olarak (**308**) yenisine gider — ama
  yalnızca proje yayındayken. Arşivlenmiş bir projeye eski slug'ından
  ulaşılamaz: yayından kaldırmak gerçekten kaldırmaktır.

**Yayın kuralı: TR *ve* EN zorunlu alanları (başlık, tek cümle, problem, durum
etiketi) dolu olmadan yayınlayamazsınız.** Tek dilli bir proje, sitemap'in söz
verdiği ama karşılığı olmayan bir hreflang çifti üretir. Eksik çeviriyle
**kaydedebilirsiniz** — taslak, yarım kalmış işin meşru hâlidir.

**Kalıcı silme yok.** Yalnızca arşiv. Silinen bir slug'la birlikte dünyadaki
bağlantılar, `fit.ts` eşleşmeleri ve geçmiş taleplerin referansları da gider;
arşiv geri alınabilir, silme alınamaz. Gerçekten silmek gerekirse bu bir SQL
konsolu işidir, gece 1'de basılabilecek bir düğme değil.

**Görsel yükleme yok** — bilinçli. Bugün sitede hiç ekran görüntüsü yok; olmayan
bir sorun için depolama sağlayıcısı seçmiyoruz. Alanlar yol/adres kabul eder.

**Zengin metin yok.** Her alan düz metin, satır listesi ya da `Ad :: Not` çifti.
HTML kabul edilmez — bu, XSS yüzeyini savunmak yerine ortadan kaldırır ve her
alanın tasarlanmış bir bileşene render edilmesini garanti eder.

**Slug değişirse** eski slug `project_slug_redirects` tablosuna yazılır ve
herkese açık rota onu **308** ile tüketir.

**Sistem türü (fit)** artık projenin kendi alanıdır. Panelde seçtiğiniz değer
sihirbaz ön-seçimini besler; `fit.ts` içindeki eski harita yalnızca seed/parity
içindir ve panelden açılan bir projeyi tanımaz.

**Yetkinlik matrisi** (proje detayındaki 9 kutucuk) editoryal bir eşlemedir ve
yalnızca ilk beş proje için tanımlıdır. Panelden açılan bir projede **hiç
gösterilmez** — boş bir matris "0 / 9" yazardı, ki bu bir iddiadır.

Önizleme: `/admin/projects/<id>/preview` — yalnızca giriş yapmış sahibe açıktır,
paylaşılabilir bağlantı ya da token yoktur. **38D'den beri önizleme, yayın
sayfasının kendisidir**: aynı bileşen ağacı, taslak veriyle. Gördüğünüz şey
yayınlanacak şeydir.

İçeriği veritabanına aktarmak / doğrulamak:

```bash
pnpm cms:seed      # typed dosyaları birebir kopyalar (idempotent)
pnpm cms:verify    # dosya ↔ veritabanı eşitliğini kanıtlar
```

## 11. Sonraki faz

33E ziyaretçi analitiğini (çerezsiz) ekleyecek. Panelde şu an **hiçbir trafik
verisi yoktur** ve dashboard bunu açıkça söyler: tüm sayılar form
gönderimlerinden gelir.
