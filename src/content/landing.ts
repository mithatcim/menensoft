/**
 * Yüksek niyetli arama sayfaları (Phase 40).
 *
 * Bunlar "doorway" sayfa DEĞİLDİR ve öyle olmamalıdır: her biri mevcut bir
 * sektör/sistem sayfasıyla akraba ama farklı bir soruya cevap verir, ve her biri
 * gerçekten kurulmuş bir projeye bağlanır. Uydurma müşteri, uydurma metrik,
 * uydurma referans yok — sitenin geri kalanındaki kurallar burada da geçerli.
 *
 * ÖNEMLİ: Trendyol satıcıları sayfası BİLEREK yazılmadı. Arkasında gerçek bir
 * Trendyol entegrasyon projesi yok; olmayan bir yetkinliği iddia eden bir sayfa,
 * getireceği trafikten daha pahalıya mal olur.
 *
 * Her sayfa hem TR hem EN'de var olmak zorundadır: sitemap her Türkçe rotayı
 * İngilizce eşiyle çiftler, ve eşi olmayan bir rota sitemap'e 404 veren bir URL
 * koyar.
 */

export interface LandingFaq {
  q: string;
  a: string;
}

export interface LandingPage {
  slug: string;
  eyebrow: string;
  /** Sayfanın h1'i. */
  title: string;
  /** h1'in hemen altındaki tek paragraf — alıntılanabilir olmalı. */
  intro: string;
  /** "Bu sayfa kimin için?" — dürüst hedef kitle. */
  whoFor: string[];
  /** Çözülen gerçek problemler. */
  problems: string[];
  /** Kurulan yapı. */
  features: string[];
  /** Nasıl ilerliyoruz. */
  process: { step: string; note: string }[];
  faq: LandingFaq[];
  /** Gerçekten kurulmuş projeler — src/content/projects.ts slug'ları. */
  relatedProjects: string[];
  /** src/content/systems.ts slug'ları. */
  relatedSystems: string[];
  /** src/content/sectors.ts slug'ları. */
  relatedSectors: string[];
  /** Sihirbaz ön seçimi (src/content/fit.ts id'leri). */
  fitId?: string;
  ctaTitle: string;
  ctaText: string;
  seoTitle: string;
  seoDescription: string;
}

export const landingPages: LandingPage[] = [
  /* ---------------------------------------------------------------------- */
  {
    slug: "e-ticaret-sitesi",
    eyebrow: "E-ticaret altyapısı",
    title: "E-ticaret sitesi kurulumu",
    intro:
      "Ürünleri yöneten panelin, onları satan sayfaları da yönettiği tek sistem. Hazır bir mağaza temasının üstüne eklenti yığmak yerine, ürün verisi ile vitrinin aynı yerden yönetildiği bir altyapı kuruyoruz.",
    whoFor: [
      "Kendi ürününü satan, stok ve kategoriyi kendi yöneten işletmeler",
      "Hazır platformun kısıtlarına çarpmış, kendi akışını isteyenler",
      "Vitrin sayfalarını kodla değil, panelden kurmak isteyenler",
    ],
    problems: [
      "Mağaza sistemi ile site kurucu ayrı ayrı yönetiliyor, ikisi birbirini tutmuyor",
      "Ürün bilgisi bir yerde, o ürünü satan sayfa başka bir yerde güncelleniyor",
      "Kampanya sayfası açmak için her seferinde geliştirici gerekiyor",
      "Panelde yapılan değişikliğin vitrine yansıdığından emin olunamıyor",
    ],
    features: [
      "Ürün ve kategori yönetimi — ticaretin veri çekirdeği",
      "Ürün ve kategori sayfalarıyla çalışan vitrin",
      "İçerik yönetimli görsel sayfa kurucu: vitrin sayfaları kod yazmadan kurulur",
      "Tek yönetim yüzeyi: ticaret ve içerik aynı panelden",
      "Panel ile vitrin arasında tutarlı veri",
    ],
    process: [
      { step: "Kapsam", note: "Ne satıyorsunuz, hangi akış gerçekten gerekiyor" },
      { step: "Veri modeli", note: "Ürün, kategori ve ilişkiler önce doğru kurulur" },
      { step: "Panel", note: "Ürünlerin ve içeriğin yönetildiği kontrol ekranları" },
      { step: "Vitrin", note: "Yönetilen içerikten beslenen müşteri sayfaları" },
    ],
    faq: [
      {
        q: "Hazır e-ticaret platformu yerine neden özel sistem?",
        a: "Hazır platform hızlı başlatır, sonra kısıtlar. Kendi akışınız platformun izin verdiği akıştan farklıysa, her istisna bir eklentiye ya da geçici çözüme dönüşür. Özel sistem baştan biraz daha uzun sürer ama akış sizin işinize göre kurulur.",
      },
      {
        q: "Vitrin sayfalarını kendim güncelleyebilir miyim?",
        a: "Evet. Görsel sayfa kurucu tam olarak bunun için var: vitrin sayfaları panelden, kod yazmadan kurulur ve güncellenir.",
      },
      {
        q: "Ürün verisi ile sayfa içeriği nasıl tutarlı kalıyor?",
        a: "İkisi ayrı sistem değil. Ürünleri yöneten panel, onları satan sayfaları da yönetir — bu yüzden birbirinden kopamazlar.",
      },
      {
        q: "Bu daha önce kuruldu mu?",
        a: "Evet. E-Ticaret CMS & Görsel Site Kurucu projesi tamamlanmış bir ürün altyapısıdır: yönetim paneli, vitrin ve görsel sayfa kurucu birlikte çalışır durumda.",
      },
    ],
    relatedProjects: ["ecommerce-cms"],
    relatedSystems: ["e-ticaret-sistemi", "admin-panel"],
    relatedSectors: ["e-ticaret-yonetim-sistemi"],
    fitId: "e-ticaret",
    ctaTitle: "E-ticaret altyapınızı konuşalım",
    ctaText:
      "Ne sattığınızı ve bugün nerede tıkandığınızı yazın; hangi yapının gerçekten gerektiğini birlikte netleştirelim.",
    seoTitle: "E-ticaret sitesi kurulumu — yönetim panelli e-ticaret altyapısı",
    seoDescription:
      "Ürünleri yöneten panelin, onları satan sayfaları da yönettiği e-ticaret altyapısı. Görsel sayfa kurucu, ürün/kategori yönetimi ve çalışan vitrin — hazır tema değil, kurulan sistem.",
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "admin-panelli-web-sitesi",
    eyebrow: "Yönetim paneli",
    title: "Admin panelli web sitesi",
    intro:
      "İçeriğini kendiniz yönettiğiniz web sitesi. Her metin değişikliği için geliştirici beklemek zorunda kalmadığınız, panelden güncellenen ve güncellendiği anda yayına çıkan bir yapı.",
    whoFor: [
      "Sitesini kendi güncellemek isteyen işletmeler",
      "İçeriği sık değişen, her seferinde ajans beklemek istemeyenler",
      "Ekibindeki teknik olmayan kişilerin de yönetebilmesi gerekenler",
    ],
    problems: [
      "Bir cümleyi değiştirmek için bile geliştirici gerekiyor",
      "İçerik güncellemesi günler sürüyor, fırsat kaçıyor",
      "Kimin neyi değiştirdiği takip edilemiyor",
      "Yayınlanmamış bir taslağın yanlışlıkla siteye çıkma riski var",
    ],
    features: [
      "İçeriğin düzenlendiği yönetim paneli",
      "Taslak / yayında ayrımı: hazır olmayan içerik siteye çıkmaz",
      "Rol bazlı erişim — herkes yalnızca yetkili olduğu yeri görür",
      "Değişiklik yayına anında yansır, yeniden kurulum gerekmez",
      "Yapılandırılmış alanlar: panel siteyi bozamaz",
    ],
    process: [
      { step: "Alanlar", note: "Hangi içeriğin gerçekten değişmesi gerekiyor" },
      { step: "Panel", note: "O alanların yapılandırılmış editörü" },
      { step: "Yayın akışı", note: "Taslak, önizleme, yayın — bu sırayla" },
      { step: "Devir", note: "Panelin nasıl kullanılacağı gösterilir" },
    ],
    faq: [
      {
        q: "Panelden yaptığım değişiklik ne zaman yayına çıkar?",
        a: "Kaydettiğiniz anda. Yeniden kurulum ya da deploy beklemezsiniz.",
      },
      {
        q: "Yanlışlıkla yarım bir içeriği yayınlar mıyım?",
        a: "Hayır. Taslak ile yayında olan içerik ayrıdır; yayınlamak ayrı ve bilinçli bir adımdır. Yayınlamadan önce önizleyebilirsiniz.",
      },
      {
        q: "Panel siteyi bozabilir mi?",
        a: "Yapılandırılmış alanlarla çalıştığı için hayır. Serbest HTML girilmez; her alan tasarlanmış bir bileşene render edilir.",
      },
      {
        q: "Bu panelin gerçek bir örneği var mı?",
        a: "Evet. Orva Psikoloji projesinde site ve yönetim paneli birlikte kuruldu; bu sitenin kendi proje içeriği de aynı mantıkla panelden yönetiliyor.",
      },
    ],
    relatedProjects: ["orva-psychology", "ecommerce-cms"],
    relatedSystems: ["admin-panel", "kurumsal-web-sitesi"],
    relatedSectors: ["psikoloji-klinik-randevu-sistemi"],
    fitId: "yonetim-paneli",
    ctaTitle: "Kendi panelinizi konuşalım",
    ctaText:
      "Hangi içeriği kendiniz yönetmek istediğinizi yazın; panelin neyi kapsaması gerektiğini birlikte çıkaralım.",
    seoTitle: "Admin panelli web sitesi — içeriğini kendiniz yönetin",
    seoDescription:
      "Yönetim panelli web sitesi: içeriği panelden güncelleyin, taslak/yayın ayrımıyla çalışın, her değişiklik için geliştirici beklemeyin. Yapılandırılmış alanlar, rol bazlı erişim.",
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "qr-menu-sistemi",
    eyebrow: "Restoran & kafe",
    title: "QR menü sistemi",
    intro:
      "Müşterinin telefonuyla açtığı, baskı gerektirmeyen menü. Fiyat değişimi için yeniden tasarım ve matbaa beklemezsiniz; menüyü panelden günceller, aynı anda yayına verirsiniz.",
    whoFor: [
      "Menüsü sık değişen restoran ve kafeler",
      "Baskı maliyetinden ve gecikmesinden kurtulmak isteyenler",
      "Menüyü sipariş akışına bağlamak isteyen işletmeler",
    ],
    problems: [
      "Menü değişikliği için baskı ve yeniden tasarım gerekiyor",
      "Fiyat güncellemesi masalara günler sonra ulaşıyor",
      "Tükenen ürün menüde durmaya devam ediyor",
      "Menü bir PDF; sipariş akışıyla hiçbir bağı yok",
    ],
    features: [
      "Telefonda hızlı açılan, uygulama indirtmeyen QR menü",
      "Ürün, fiyat ve kategori panelden güncellenir",
      "Menü, sipariş akışına bağlanabilir — sadece bir görüntü değil",
      "Tükenen ürünü anında menüden düşürme",
    ],
    process: [
      { step: "Menü modeli", note: "Kategori, ürün, fiyat, varyant" },
      { step: "QR akışı", note: "Masadan menüye, menüden siparişe" },
      { step: "Panel", note: "Menünün yönetildiği ekran" },
      { step: "Operasyon", note: "İsteğe bağlı: sipariş akışına bağlama" },
    ],
    faq: [
      {
        q: "Müşteri uygulama indirmek zorunda mı?",
        a: "Hayır. QR kodu okuttuğunda menü tarayıcıda açılır.",
      },
      {
        q: "Menüyü kendim güncelleyebilir miyim?",
        a: "Evet — ürün, fiyat ve kategoriler panelden yönetilir. Baskı ya da yeniden tasarım gerekmez.",
      },
      {
        q: "QR menü ile sipariş sistemi aynı şey mi?",
        a: "Değil. QR menü müşterinin gördüğü taraftır; sipariş sistemi o siparişin mutfağa ve kasaya nasıl aktığıdır. İkisi birlikte de kurulabilir, ayrı ayrı da.",
      },
      {
        q: "Bunun kurulmuş bir örneği var mı?",
        a: "Evet. Restoran QR Menü & Operasyon Sistemi projesinde QR menü, sipariş yönlendirme ve rol bazlı ekranlar birlikte kuruldu.",
      },
    ],
    relatedProjects: ["restaurant-qr-system"],
    relatedSystems: ["operasyon-sistemi", "is-akisi-otomasyonu"],
    relatedSectors: ["restoran-qr-siparis-sistemi"],
    fitId: "operasyon",
    ctaTitle: "Menünüzü konuşalım",
    ctaText:
      "Menünüzün ne sıklıkla değiştiğini ve siparişin bugün nasıl aktığını yazın; nereden başlamak gerektiğini söyleyeyim.",
    seoTitle: "QR menü sistemi — panelden yönetilen dijital restoran menüsü",
    seoDescription:
      "Baskı gerektirmeyen QR menü: ürün, fiyat ve kategoriyi panelden güncelleyin, aynı anda yayına verin. İsteğe bağlı olarak sipariş akışına bağlanır.",
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "restoran-siparis-sistemi",
    eyebrow: "Restoran & kafe",
    title: "Restoran sipariş sistemi",
    intro:
      "Masadan mutfağa tek akış. Siparişin garson, mutfak ve kasa arasında elle taşınmadığı; doğru istasyona kendiliğinden gittiği ve durumunun her ekranda aynı anda göründüğü bir operasyon sistemi.",
    whoFor: [
      "Yoğun saatte sipariş kaybeden restoran ve kafeler",
      "Gün sonu hesabı ile alınan siparişi tutturamayanlar",
      "Garson, mutfak ve kasa arasındaki kağıt trafiğinden kurtulmak isteyenler",
    ],
    problems: [
      "Siparişler garson, mutfak ve kasa arasında elle taşınıyor",
      "Yoğun saatlerde sipariş kayboluyor ya da sıra karışıyor",
      "Gün sonu hesabı ile alınan siparişler birbirini tutmuyor",
      "İşin durumu ancak salona çıkıp bakınca görülüyor",
    ],
    features: [
      "Siparişi doğru istasyona yönlendiren iş akışı",
      "Garson, mutfak ve kasa için ayrı rol ekranları",
      "Sıraya giren siparişler ve durumlarını gösteren mutfak ekranı",
      "Hesap ve gün sonu görünümü veren kasa ekranı",
      "Durum değişiminin tüm ekranlara anında yansıması",
    ],
    process: [
      { step: "Akış", note: "Sipariş bugün fiilen nasıl ilerliyor" },
      { step: "Roller", note: "Kim hangi ekranı görmeli, kim görmemeli" },
      { step: "Yönlendirme", note: "Siparişin istasyona otomatik gitmesi" },
      { step: "Gün sonu", note: "Alınan sipariş ile hesabın tutması" },
    ],
    faq: [
      {
        q: "QR menü olmadan sadece sipariş sistemi kurulabilir mi?",
        a: "Evet. QR menü müşteri tarafıdır; sipariş sistemi mutfak ve kasa tarafıdır. İkisi ayrı ayrı da kurulabilir.",
      },
      {
        q: "Her çalışan her şeyi görecek mi?",
        a: "Hayır. Rol bazlı erişim var: garson, mutfak ve kasa yalnızca kendi ekranını görür.",
      },
      {
        q: "Gün sonu hesabı neden tutmuyor, sistem bunu nasıl çözüyor?",
        a: "Sipariş elle taşındığında bir yerde kaydı düşmüyor. Sipariş sistemde doğduğunda kaydı zaten var — gün sonu görünümü uydurma değil, alınan siparişin kendisi.",
      },
      {
        q: "Bunun kurulmuş bir örneği var mı?",
        a: "Evet. Restoran QR Menü & Operasyon Sistemi projesinde masadan mutfağa tek akış, rol ekranlarıyla birlikte kuruldu.",
      },
    ],
    relatedProjects: ["restaurant-qr-system"],
    relatedSystems: ["operasyon-sistemi", "is-akisi-otomasyonu"],
    relatedSectors: ["restoran-qr-siparis-sistemi"],
    fitId: "operasyon",
    ctaTitle: "Sipariş akışınızı konuşalım",
    ctaText:
      "Siparişin bugün masadan mutfağa nasıl gittiğini yazın; nerede koptuğunu birlikte görelim.",
    seoTitle: "Restoran sipariş sistemi — masadan mutfağa tek akış",
    seoDescription:
      "Sipariş yönlendirme, mutfak ve kasa ekranları, rol bazlı erişim. Kağıt fiş ve sözlü sipariş yerine bir iş gününü taşıyan çalışır operasyon sistemi.",
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "psikolog-web-sitesi",
    eyebrow: "Psikoloji & klinik",
    title: "Psikolog web sitesi",
    intro:
      "Danışanın güven duyduğu, sizin kendiniz yönettiğiniz bir site. İçeriği panelden günceller, randevu ve iletişim akışını sitenin içine kurar; her değişiklik için ajans beklemezsiniz.",
    whoFor: [
      "Kendi kliniğini ya da muayenehanesini yöneten psikologlar",
      "İçeriğini (yazı, hizmet, ekip) kendisi güncellemek isteyenler",
      "Randevu ve iletişim trafiğini düzenli bir akışa bağlamak isteyenler",
    ],
    problems: [
      "Site bir kere kuruldu, sonra kimse güncelleyemiyor",
      "Yeni bir hizmet ya da yazı eklemek için geliştirici gerekiyor",
      "Randevu talepleri WhatsApp, telefon ve e-posta arasında dağılıyor",
      "Danışan güveni için gereken ciddiyeti hazır tema vermiyor",
    ],
    features: [
      "İçeriğin panelden yönetildiği kurumsal site",
      "Hizmet, yazı ve ekip içeriği için yapılandırılmış alanlar",
      "İletişim ve randevu talebi için tek, düzenli akış",
      "Danışan gizliliğini gözeten sade veri yaklaşımı",
    ],
    process: [
      { step: "İçerik", note: "Hangi bölümlerin gerçekten güncellenmesi gerekiyor" },
      { step: "Site", note: "Güven veren, sade ve hızlı yapı" },
      { step: "Panel", note: "İçeriğin yönetildiği ekran" },
      { step: "İletişim", note: "Randevu/iletişim talebinin tek akışa bağlanması" },
    ],
    faq: [
      {
        q: "Siteyi kendim güncelleyebilir miyim?",
        a: "Evet. Hizmetler, yazılar ve sayfa içerikleri panelden yönetilir; teknik bilgi gerekmez.",
      },
      {
        q: "Danışan verisi nasıl korunuyor?",
        a: "Toplanmayan veri sızmaz. Form yalnızca gerekli alanları alır; gereksiz kişisel veri saklanmaz ve gizlilik sayfası ne toplandığını açıkça yazar.",
      },
      {
        q: "Randevu sistemi de kurulabilir mi?",
        a: "Kapsama göre. Basit hâli iletişim/randevu talebi akışıdır; takvim ve seans yönetimi ayrı bir kapsamdır ve konuşarak netleştirilir.",
      },
      {
        q: "Bunun kurulmuş bir örneği var mı?",
        a: "Evet. Orva Psikoloji projesinde web sitesi ve yönetim paneli birlikte kuruldu.",
      },
    ],
    relatedProjects: ["orva-psychology"],
    relatedSystems: ["kurumsal-web-sitesi", "admin-panel"],
    relatedSectors: ["psikoloji-klinik-randevu-sistemi"],
    fitId: "kurumsal-site",
    ctaTitle: "Kliniğinizin sitesini konuşalım",
    ctaText:
      "Bugün neyi kendiniz güncelleyemediğinizi yazın; sitenin neyi kapsaması gerektiğini birlikte çıkaralım.",
    seoTitle: "Psikolog web sitesi — panelden yönetilen klinik sitesi",
    seoDescription:
      "Psikolog ve klinikler için yönetim panelli web sitesi: içeriği kendiniz güncelleyin, randevu ve iletişim taleplerini tek akışta toplayın. Sade, hızlı ve gizliliğe saygılı.",
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "ozel-yazilim-gelistirme",
    eyebrow: "Özel yazılım",
    title: "Özel yazılım geliştirme",
    intro:
      "Hazır bir ürünün kısıtlarına sığmayan iş akışları için, işin kendisine göre kurulan sistem. Şablon değil: veri modeli, panel ve arayüz sizin akışınıza göre tasarlanır.",
    whoFor: [
      "İşi hazır bir ürünün varsaydığı akışa uymayan işletmeler",
      "Eklenti ve geçici çözüm yığınına dönmüş sistemleri olanlar",
      "Bir süreci uçtan uca dijitalleştirmek isteyenler",
    ],
    problems: [
      "Hazır ürün işin %80'ini yapıyor, kalan %20 her gün elle kapatılıyor",
      "Her istisna bir eklentiye ya da Excel'e taşınıyor",
      "Veri birden fazla yerde, hangisinin doğru olduğu bilinmiyor",
      "Sistem büyüdükçe kimse neyin nasıl çalıştığını açıklayamıyor",
    ],
    features: [
      "İş akışına göre kurulan veri modeli",
      "Süreci gerçekten taşıyan yönetim paneli",
      "Rol bazlı erişim ve denetlenebilir işlem kaydı",
      "Devredilebilir yapı: kod ve kararlar açıklanabilir durumda",
    ],
    process: [
      { step: "Kapsam", note: "Hangi süreç, nerede tıkanıyor" },
      { step: "Model", note: "Veri ve akış önce doğru kurulur" },
      { step: "Panel", note: "Süreci taşıyan ekranlar" },
      { step: "Devir", note: "Nasıl çalıştığı anlatılır, kod teslim edilir" },
    ],
    faq: [
      {
        q: "Hazır ürün yerine ne zaman özel yazılım gerekir?",
        a: "İşin istisnaları kural hâline geldiyse. Hazır ürünü her gün elle düzeltiyorsanız, o düzeltmeler zaten sizin gerçek sisteminizdir — sadece yazılıma dökülmemiştir.",
      },
      {
        q: "Bu daha pahalı değil mi?",
        a: "Başlangıçta daha uzun sürer. Karşılığında her ay elle kapatılan boşluk ortadan kalkar. Hangisinin daha pahalı olduğu, o boşluğun gerçek maliyetine bağlıdır.",
      },
      {
        q: "Kod bana ait olacak mı?",
        a: "Evet. Yapı devredilebilir olmak üzere kurulur; kararlar ve kod açıklanabilir durumda teslim edilir.",
      },
      {
        q: "Nereden başlanır?",
        a: "Süreçten, yazılımdan değil. Önce hangi akışın nerede koptuğunu netleştiririz; kapsam ondan sonra çıkar.",
      },
    ],
    relatedProjects: ["log-management-platform", "cendovar", "ecommerce-cms"],
    relatedSystems: ["is-akisi-otomasyonu", "operasyon-sistemi", "admin-panel"],
    relatedSectors: ["operasyon-dashboard-sistemi", "guvenlik-log-yonetimi"],
    fitId: "otomasyon",
    ctaTitle: "Sürecinizi konuşalım",
    ctaText:
      "Bugün elle kapattığınız boşluğu yazın; yazılıma dökülmesi gerekenin ne olduğunu birlikte görelim.",
    seoTitle: "Özel yazılım geliştirme — işinize göre kurulan sistem",
    seoDescription:
      "Hazır ürünün kısıtlarına sığmayan iş akışları için özel yazılım: veri modeli, yönetim paneli ve arayüz sizin sürecinize göre kurulur. Devredilebilir, açıklanabilir yapı.",
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "isletmeler-icin-web-sistemi",
    eyebrow: "İşletmeler için",
    title: "İşletmeler için web sistemi",
    intro:
      "Broşür site değil, çalışan sistem. İşletmenin bir sürecini fiilen taşıyan — veri girilen, iş akan, durum görünen — ve panelden yönetilen web tabanlı yapı.",
    whoFor: [
      "Sitesi var ama işine hiçbir katkısı olmayan işletmeler",
      "Süreci hâlâ Excel ve WhatsApp'ta yürüyenler",
      "Web'i bir vitrin değil, bir araç olarak kullanmak isteyenler",
    ],
    problems: [
      "Site sadece bir broşür; hiçbir işi taşımıyor",
      "Gerçek iş Excel, WhatsApp ve kağıtta yürüyor",
      "Verinin nerede olduğu ve hangisinin doğru olduğu belirsiz",
      "İşin durumu ancak birine sorunca öğreniliyor",
    ],
    features: [
      "Süreci taşıyan yönetim paneli",
      "Rol bazlı erişim: herkes kendi ekranını görür",
      "Durumu tek bakışta gösteren ekranlar",
      "Panelden yönetilen, güncellendiği anda yayına çıkan içerik",
    ],
    process: [
      { step: "Süreç", note: "İş bugün fiilen nasıl yürüyor" },
      { step: "Kapsam", note: "Neyin dijitalleşmesi gerçekten gerekiyor" },
      { step: "Sistem", note: "Paneli, akışı ve ekranlarıyla kurulur" },
      { step: "Devir", note: "Ekibe nasıl kullanılacağı gösterilir" },
    ],
    faq: [
      {
        q: "Web sitesi ile web sistemi arasındaki fark ne?",
        a: "Site anlatır, sistem taşır. Sitede içerik vardır; sistemde veri girilir, iş akar ve durum görünür.",
      },
      {
        q: "Küçük bir işletme için fazla büyük olmaz mı?",
        a: "Kapsam işe göre çıkar. Bir sürecin bir adımını doğru taşıyan küçük bir sistem, hiç kullanılmayan büyük bir sistemden değerlidir.",
      },
      {
        q: "Mevcut sitem gidecek mi?",
        a: "Zorunlu değil. Çoğu zaman site kalır, üzerine işi taşıyan panel ve akış kurulur.",
      },
      {
        q: "Hangi sistemler kurulabiliyor?",
        a: "E-ticaret altyapısı, yönetim paneli, operasyon sistemi, dashboard ve iş akışı otomasyonu — hepsinin gerçekten kurulmuş örnekleri projeler sayfasında.",
      },
    ],
    relatedProjects: ["ecommerce-cms", "restaurant-qr-system", "cendovar"],
    relatedSystems: ["admin-panel", "operasyon-sistemi", "dashboard-raporlama"],
    relatedSectors: ["operasyon-dashboard-sistemi", "uyelik-platformu"],
    ctaTitle: "İşinizi konuşalım",
    ctaText:
      "Bugün hangi işin hangi araçta yürüdüğünü yazın; web'e taşınması gerekenin ne olduğunu birlikte görelim.",
    seoTitle: "İşletmeler için web sistemi — broşür site değil, çalışan sistem",
    seoDescription:
      "İşletmenin bir sürecini fiilen taşıyan web sistemi: yönetim paneli, rol bazlı erişim, canlı durum ekranları. Excel ve WhatsApp'ta yürüyen işi tek bir sisteme taşıyın.",
  },
];

export function getLandingPage(slug: string): LandingPage | undefined {
  return landingPages.find((p) => p.slug === slug);
}
