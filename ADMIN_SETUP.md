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

## 9. Sonraki faz

33E ziyaretçi analitiğini (çerezsiz) ekleyecek. Panelde şu an **hiçbir trafik
verisi yoktur** ve dashboard bunu açıkça söyler: tüm sayılar form
gönderimlerinden gelir.
