/**
 * Sistem türü sayfalarının içeriği (/sistemler). Her sayfa "bu sistem ne işe
 * yarar, kimler için, hangi modüller, teslimde ne alınır" sorularına cevap
 * verir. Proje bağlantıları dürüsttür; dolaylı ilişkide yumuşak ifade
 * kullanılır. Rakam, müşteri ve lansman iddiası yok.
 */

export interface SystemModule {
  name: string;
  note: string;
}

export interface SystemRelatedProject {
  slug: string;
  note: string;
}

export interface SystemType {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  /** "Bu sistem ne işe yarar?" cevabı — kısa, alıntılanabilir. */
  whatItIs: string;
  whoNeeds: string[];
  modules: SystemModule[];
  /** Mimari akış düğümleri — FlowPanel ile çizilir. */
  archFlow: string[];
  archNotes: string[];
  adminSurface: string[];
  deliverables: string[];
  relatedSectors: string[];
  relatedProjects: SystemRelatedProject[];
  ctaTitle: string;
  ctaText: string;
  seoTitle: string;
  seoDescription: string;
}

export const systems: SystemType[] = [
  {
    slug: "admin-panel",
    eyebrow: "Sistem — Yönetim paneli",
    title: "Admin panel",
    description:
      "Ekibinizin giriş yapıp günü yönettiği iç yüzey: veri, içerik, sipariş ve kullanıcılar tek panelden, rol bazlı yetkiyle yönetilir.",
    whatItIs:
      "Admin panel, işletmenizin verisini tablolar ve mesajlar yerine yetkili ekranlardan yönetmenizi sağlayan iç sistemdir: kayıt ekleme ve düzenleme, arama ve filtreleme, rol bazlı erişim ve tutarlı doğrulama tek yüzeyde toplanır.",
    whoNeeds: [
      "Veriyi Excel ve mesaj gruplarında yöneten işletmeler",
      "İçerik değişikliği için geliştirici bekleyen ekipler",
      "Kim neyi değiştirdi sorusuna cevap arayan yöneticiler",
      "Birden çok kişinin aynı veriye dokunduğu operasyonlar",
    ],
    modules: [
      { name: "Kayıt yönetimi", note: "Çekirdek veriler için ekleme, düzenleme, arşiv" },
      { name: "Veri tabloları", note: "Arama, filtre ve sıralama ile hızlı erişim" },
      { name: "Rol & yetki", note: "Hassas alanlara kademeli erişim" },
      { name: "Formlar & doğrulama", note: "Hatalı kaydın baştan engellenmesi" },
      { name: "İçerik ekranları", note: "Metin ve görsellerin panelden yönetimi" },
    ],
    archFlow: ["Veri modeli", "Backend", "Panel", "Roller"],
    archNotes: [
      "Şema, işin gerçek ilişkilerine göre tasarlanır",
      "Backend kuralları veriyi her ekranda tutarlı tutar",
      "Panel ekranları role göre daralır ya da genişler",
    ],
    adminSurface: [
      "Tek girişten tüm yönetim ekranlarına erişim",
      "Role göre görünen menü ve yetkiler",
      "Hızlı arama ve filtreli listeler",
      "Doğrulamalı, hataya kapalı formlar",
    ],
    deliverables: [
      "Çalışır admin panel ve ekranları",
      "Rol bazlı erişim yapısı",
      "Sürdürülebilir kod tabanı",
      "Dokümantasyon ve temiz devir",
    ],
    relatedSectors: [
      "e-ticaret-yonetim-sistemi",
      "psikoloji-klinik-randevu-sistemi",
      "operasyon-dashboard-sistemi",
    ],
    relatedProjects: [
      { slug: "ecommerce-cms", note: "Ürün ve içerik yönetim paneli" },
      { slug: "restaurant-qr-system", note: "Rol bazlı operasyon ekranları" },
      { slug: "orva-psychology", note: "İçerik ve talep yönetim paneli" },
    ],
    ctaTitle: "Verinizi panele taşıyın",
    ctaText:
      "Bugün hangi veriyi nerede yönetiyorsunuz? Yazın; panelin ekranlarını birlikte çıkaralım.",
    seoTitle: "Admin Panel Geliştirme",
    seoDescription:
      "İşletmeler için özel admin panel geliştirme: kayıt yönetimi, veri tabloları, rol bazlı yetki ve doğrulamalı formlar. Excel ve mesaj trafiği yerine tek yönetim yüzeyi.",
  },
  {
    slug: "e-ticaret-sistemi",
    eyebrow: "Sistem — E-ticaret",
    title: "E-ticaret sistemi",
    description:
      "Vitrin ve yönetim katmanı tek altyapıda: ürün kataloğu, hızlı müşteri sayfaları, sipariş ekranları ve kod gerektirmeyen içerik yönetimi.",
    whatItIs:
      "E-ticaret sistemi, online satışın iki yüzünü tek altyapıda birleştirir: müşterinin gördüğü hızlı vitrin ve ekibinizin ürün, sipariş, içerik yönettiği panel. Hazır paket kiralamak yerine sahip olduğunuz bir sistemdir.",
    whoNeeds: [
      "Hazır paketin özelleştirme sınırına takılan satıcılar",
      "Ürün yapısı şablonlara sığmayan işletmeler",
      "İçeriği teknik destek beklemeden yönetmek isteyen ekipler",
      "Altyapısına ve verisine sahip olmak isteyenler",
    ],
    modules: [
      { name: "Ürün & katalog", note: "Ürün, kategori ve ilişki yönetimi" },
      { name: "Vitrin", note: "Hızlı, temiz ürün ve kategori sayfaları" },
      { name: "Görsel sayfa kurucu", note: "Sayfa düzenleri kodsuz kurulur" },
      { name: "Sipariş ekranları", note: "Sipariş listesi ve durum takibi" },
      { name: "İçerik yönetimi", note: "Kampanya ve sayfa içerikleri panelden" },
    ],
    archFlow: ["Katalog", "Backend", "Vitrin", "Sipariş"],
    archNotes: [
      "Ürün verisi tek kaynaktan vitrine akar",
      "Sipariş kayıtları panel ekranlarına düşer",
      "Sayfa düzenleri içerikten ayrı, görsel olarak yönetilir",
    ],
    adminSurface: [
      "Ürün ve fiyat yönetimi",
      "Sipariş takibi",
      "İçerik ve sayfa düzeni yönetimi",
      "Editör / yönetici yetki ayrımı",
    ],
    deliverables: [
      "Çalışır vitrin + panel altyapısı",
      "Ürün, sipariş ve içerik ekranları",
      "Görsel sayfa kurulum sistemi",
      "Dokümantasyon ve temiz devir",
    ],
    relatedSectors: ["e-ticaret-yonetim-sistemi", "operasyon-dashboard-sistemi"],
    relatedProjects: [
      { slug: "ecommerce-cms", note: "Bu sistem türünde kurulan ürün altyapısı" },
    ],
    ctaTitle: "Kendi satış altyapınızı kurun",
    ctaText:
      "Bugün hangi platformdasınız, neyi değiştiremiyorsunuz? Yazın; geçişin gerçekçi bir yolunu konuşalım.",
    seoTitle: "Özel E-Ticaret Sistemi Geliştirme",
    seoDescription:
      "Hazır paket sınırına takılmadan sahip olduğunuz e-ticaret sistemi: ürün kataloğu, hızlı vitrin, sipariş ekranları, görsel sayfa kurucu ve içerik yönetimi tek altyapıda.",
  },
  {
    slug: "dashboard-raporlama",
    eyebrow: "Sistem — Dashboard & raporlama",
    title: "Dashboard ve raporlama",
    description:
      "İşin anlık durumunu tek bakışta gösteren canlı ekranlar: role özel görünümler, durum akışları ve elle derlenmeyen özetler.",
    whatItIs:
      "Dashboard sistemi, operasyon verisini kişilerin aklından ekrana taşır: kim neyi bekliyor, hangi iş nerede, gün nasıl gidiyor — sormadan, tek bakışta görünür. Raporlar elle derlenmez; tek kaynaktan beslenir.",
    whoNeeds: [
      "İşin durumunu telefonla sorarak öğrenen yöneticiler",
      "Gün sonu tablosunu elle derleyen ekipler",
      "Birden çok rolün aynı anda çalıştığı operasyonlar",
      "Kayıt var ama görünürlük yok diyen işletmeler",
    ],
    modules: [
      { name: "Canlı durum ekranı", note: "Anlık operasyon tablosu" },
      { name: "Role özel görünüm", note: "Her rol kendi işine bakar" },
      { name: "Liste & filtre", note: "Kayıtlara hızlı erişim" },
      { name: "Durum akışı", note: "Bekleyen, işlemde, tamamlanan" },
      { name: "Özetler", note: "Gün sonu ve dönem görünümleri" },
    ],
    archFlow: ["Olaylar", "Veri katmanı", "Görünümler", "Aksiyon"],
    archNotes: [
      "Tüm ekranlar tek veri kaynağından beslenir",
      "Durum değişimi ilgili görünümlere anında yansır",
      "Görünümler role göre tasarlanır, genel geçer şablon değil",
    ],
    adminSurface: [
      "Rol bazlı dashboard ekranları",
      "Kayıt ve durum yönetimi",
      "Filtreli, aranabilir listeler",
      "Özet görünümler",
    ],
    deliverables: [
      "Çalışır dashboard ekranları",
      "Durum akışlı kayıt yönetimi",
      "Rol bazlı erişim",
      "Dokümantasyon ve temiz devir",
    ],
    relatedSectors: [
      "operasyon-dashboard-sistemi",
      "guvenlik-log-yonetimi",
      "restoran-qr-siparis-sistemi",
    ],
    relatedProjects: [
      { slug: "restaurant-qr-system", note: "Rol bazlı canlı operasyon ekranları" },
      { slug: "log-management-platform", note: "İnceleme ve durum ekranları" },
      { slug: "ecommerce-cms", note: "Yönetim ekranlarında benzer yapı" },
    ],
    ctaTitle: "İşinizi tek ekranda görün",
    ctaText:
      "Bugün neyi göremiyorsunuz? Yazın; hangi görünümlerin gerektiğine birlikte bakalım.",
    seoTitle: "Dashboard ve Raporlama Sistemi",
    seoDescription:
      "İşletmeler için canlı dashboard ve raporlama ekranları: role özel görünümler, durum akışları, filtreli listeler ve elle derlenmeyen özetler tek sistemde.",
  },
  {
    slug: "is-akisi-otomasyonu",
    eyebrow: "Sistem — İş akışı otomasyonu",
    title: "İş akışı otomasyonu",
    description:
      "Elle tekrarlanan işi devralan, amaca özel yazılım: girdi bir kez yakalanır, kurala göre yönlendirilir, ilgili herkese sistemden ulaşır.",
    whatItIs:
      "İş akışı otomasyonu, kişiye bağımlı manuel süreci yazılıma taşır: talep ya da sipariş kaynağında bir kez kaydedilir, kurallara göre doğru kişiye yönlenir ve durumu izlenir. Amaç platform kurmak değil, gerçek bir akışı devretmektir.",
    whoNeeds: [
      "Aynı veriyi birden çok yere elle giren ekipler",
      "Talepleri mesaj trafiğinde kaybeden işletmeler",
      "Süreci kişiye bağımlı yürüyen operasyonlar",
      "Tekrarlayan işin zamanını geri almak isteyenler",
    ],
    modules: [
      { name: "Girdi yakalama", note: "Talep, sipariş ya da kayıt tek noktadan" },
      { name: "Kural motoru", note: "Kaydın doğru istasyona yönlenmesi" },
      { name: "Durum takibi", note: "Akışın her adımının izlenmesi" },
      { name: "Entegrasyon", note: "Kullandığınız sistemlerle bağlantı" },
      { name: "Bildirim akışı", note: "İlgiliye sistemden haber" },
    ],
    archFlow: ["Girdi", "Kurallar", "Yönlendirme", "Takip"],
    archNotes: [
      "Önce mevcut manuel süreç dürüstçe haritalanır",
      "Araç akışa göre ölçülür; platform fantezisi kurulmaz",
      "Her adımın durumu sistemde görünür kalır",
    ],
    adminSurface: [
      "Akış kayıtlarının listesi ve durumu",
      "Kural ve yönlendirme ayarları",
      "Takılan işlerin görünürlüğü",
      "Yetkiye göre müdahale",
    ],
    deliverables: [
      "Çalışır iş akışı sistemi",
      "Yönetim ve takip ekranları",
      "Entegrasyonlar ve dokümantasyon",
      "Temiz devir",
    ],
    relatedSectors: [
      "restoran-qr-siparis-sistemi",
      "psikoloji-klinik-randevu-sistemi",
      "uyelik-platformu",
    ],
    relatedProjects: [
      { slug: "restaurant-qr-system", note: "Sipariş yönlendirme akışı" },
      { slug: "orva-psychology", note: "Randevu talebi akışı" },
      { slug: "cendovar", note: "Üyelere yayınlama akışında benzer yapı" },
    ],
    ctaTitle: "Manuel akışınızı sisteme devredin",
    ctaText:
      "Hangi iş elle dönüyor, nerede kopuyor? Yazın; otomasyonun sınırını birlikte çizelim.",
    seoTitle: "İş Akışı Otomasyonu Geliştirme",
    seoDescription:
      "Elle yürüyen süreçler için amaca özel iş akışı otomasyonu: girdi yakalama, kurallı yönlendirme, durum takibi ve entegrasyonlar. Kişiye bağımlılık yerine sistem.",
  },
  {
    slug: "kurumsal-web-sitesi",
    eyebrow: "Sistem — Kurumsal web sitesi",
    title: "Kurumsal web sitesi + panel",
    description:
      "Hızlı ve güven veren bir site, arkasında içerik ve talepleri yöneten panel: geliştirici beklemeden güncellenen, talep toplayan kurumsal yüzey.",
    whatItIs:
      "Panelle teslim edilen kurumsal site, vitrinden fazlasıdır: içerik panelden güncellenir, ziyaretçi talepleri sistemde toplanır, sayfa yapısı arama motorlarına uygun kurulur. Site donmaz; işletmeyle birlikte yaşar.",
    whoNeeds: [
      "Her içerik değişikliği için geliştirici bekleyen işletmeler",
      "Sitesi olan ama talepleri e-postada kaybolan ekipler",
      "Güven veren, hızlı bir kurumsal yüz isteyenler",
      "Randevu ya da teklif talebi toplayan hizmet işletmeleri",
    ],
    modules: [
      { name: "Kurumsal sayfalar", note: "Hizmet, ekip ve bilgilendirme yapısı" },
      { name: "İçerik yönetimi", note: "Metin ve görseller panelden" },
      { name: "Talep akışı", note: "Form başvurularının panele düşmesi" },
      { name: "SEO yapısı", note: "Semantik, hızlı, taranabilir sayfalar" },
      { name: "Yetki ayrımı", note: "İçerik editörü ve yönetici rolleri" },
    ],
    archFlow: ["İçerik", "Panel", "Site", "Talepler"],
    archNotes: [
      "İçerik panelde yaşar, site oradan beslenir",
      "Talepler e-posta kutusu yerine sistemde birikir",
      "Sayfa yapısı tek h1 ve temiz hiyerarşiyle kurulur",
    ],
    adminSurface: [
      "Sayfa ve içerik yönetimi",
      "Gelen taleplerin listesi ve durumu",
      "Ekip/hizmet bilgisi yönetimi",
      "Rol bazlı erişim",
    ],
    deliverables: [
      "Çalışır kurumsal site + panel",
      "İçerik ve talep ekranları",
      "SEO'ya uygun sayfa yapısı",
      "Dokümantasyon ve temiz devir",
    ],
    relatedSectors: ["psikoloji-klinik-randevu-sistemi"],
    relatedProjects: [
      { slug: "orva-psychology", note: "Bu sistem türünde kurulan site + panel" },
    ],
    ctaTitle: "Sitenizi yönetilebilir hale getirin",
    ctaText:
      "Mevcut siteniz neyi yapamıyor? Yazın; sitenin panelle nasıl yaşayacağını planlayalım.",
    seoTitle: "Kurumsal Web Sitesi ve Yönetim Paneli",
    seoDescription:
      "Panelden yönetilen kurumsal web sitesi: içerik yönetimi, talep toplama akışı, SEO'ya uygun hızlı sayfalar ve rol bazlı erişim. Donmuş vitrin değil, yaşayan site.",
  },
  {
    slug: "operasyon-sistemi",
    eyebrow: "Sistem — Operasyon sistemi",
    title: "Operasyon sistemi",
    description:
      "Çok rollü işletmeler için tek akış: girdi kaynağında bir kez yakalanır, her istasyon kendi ekranında çalışır, durum herkes için aynıdır.",
    whatItIs:
      "Operasyon sistemi, bir işletmenin gününü taşıyan çok rollü yazılımdır: sipariş ya da talep bir kez kaydedilir, mutfak-kasa-saha gibi her istasyona kendi ekranıyla ulaşır, tüm roller aynı canlı durumu görür.",
    whoNeeds: [
      "Tek girdinin birden çok istasyona elle taşındığı işletmeler",
      "Vardiya boyunca kesintisiz çalışan ekran isteyen ekipler",
      "Rol karmaşasında iş kaçıran operasyonlar",
      "Restoran, servis ve saha gibi çok istasyonlu işler",
    ],
    modules: [
      { name: "Girdi yakalama", note: "Sipariş/talep kaynağında bir kez" },
      { name: "İstasyon ekranları", note: "Her rol için ayrı çalışma ekranı" },
      { name: "Canlı durum", note: "Tüm rollerde aynı anlık tablo" },
      { name: "Akış yönetimi", note: "İşin istasyonlar arası ilerleyişi" },
      { name: "Gün sonu", note: "Operasyon özetleri" },
    ],
    archFlow: ["Yakala", "Yönlendir", "İstasyonlar", "Durum"],
    archNotes: [
      "Paylaşılan durum tek kaynaktan yönetilir",
      "Ekranlar istasyonun gerçek işine göre tasarlanır",
      "Sistem bir iş gününün temposuna göre kurulur",
    ],
    adminSurface: [
      "İstasyon ve rol yönetimi",
      "Canlı operasyon görünümü",
      "Kayıt ve durum ekranları",
      "Gün sonu özetleri",
    ],
    deliverables: [
      "Çalışır çok rollü operasyon sistemi",
      "İstasyon ekranları",
      "Canlı durum altyapısı",
      "Dokümantasyon ve temiz devir",
    ],
    relatedSectors: [
      "restoran-qr-siparis-sistemi",
      "operasyon-dashboard-sistemi",
      "guvenlik-log-yonetimi",
    ],
    relatedProjects: [
      { slug: "restaurant-qr-system", note: "Bu sistem türünde kurulan operasyon sistemi" },
      { slug: "log-management-platform", note: "İnceleme iş akışında benzer yapı" },
    ],
    ctaTitle: "Operasyonunuzu tek akışa bağlayın",
    ctaText:
      "İşiniz hangi istasyonlardan geçiyor, nerede kopuyor? Yazın; kapsamı beraber netleştirelim.",
    seoTitle: "Operasyon Sistemi Geliştirme",
    seoDescription:
      "Çok rollü işletmeler için operasyon sistemi: girdi bir kez yakalanır, her istasyon kendi ekranında çalışır, canlı durum herkes için aynıdır. Çalışır teslim edilen altyapı.",
  },
];

export function getSystem(slug: string): SystemType | undefined {
  return systems.find((s) => s.slug === slug);
}
