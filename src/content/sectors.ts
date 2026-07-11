/**
 * Sektör sayfalarının içeriği (/sektorler). Her sektör, gerçek bir alıcı
 * sorusuna cevap verir ve yalnızca gerçekten var olan projelere bağlanır.
 * İlişki dolaylıysa `note` alanı yumuşak ifade kullanır ("benzer yapı") —
 * müşteri, rakam veya lansman iddiası icat edilmez.
 */

export interface SectorModule {
  name: string;
  note: string;
}

export interface SectorRelatedProject {
  slug: string;
  /** İlişkinin dürüst etiketi: "bu sektör için kurulan sistem" vs "benzer yapı". */
  note: string;
}

export interface Sector {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  problem: string;
  pains: string[];
  builds: string[];
  modules: SectorModule[];
  adminNeeds: string[];
  automation: string[];
  relatedProjects: SectorRelatedProject[];
  /** src/content/systems.ts slug'ları. */
  relatedSystems: string[];
  deliverables: string[];
  avoids: string[];
  ctaTitle: string;
  ctaText: string;
  seoTitle: string;
  seoDescription: string;
}

export const sectors: Sector[] = [
  {
    slug: "restoran-qr-siparis-sistemi",
    eyebrow: "Sektör — Restoran & kafe",
    title: "Restoran QR sipariş sistemi",
    description:
      "Masadan mutfağa tek akış: QR menü, sipariş yönlendirme ve rol bazlı operasyon ekranları. Kağıt fiş ve sözlü sipariş trafiği yerine, bir iş gününü taşıyan çalışır sistem.",
    problem:
      "Yoğun saatte sipariş sözle alınır, kağıda yazılır, mutfağa elle taşınır. Sipariş kaybolur, sıra karışır, kasa gün sonunda hesabı tutturamaz. Problem eleman değil, akışın kendisidir.",
    pains: [
      "Siparişler garson, mutfak ve kasa arasında elle taşınıyor",
      "Yoğun saatlerde sipariş kayboluyor ya da sıra karışıyor",
      "Menü değişikliği için baskı ve yeniden tasarım gerekiyor",
      "Gün sonu hesabı ile alınan siparişler birbirini tutmuyor",
      "İşin durumu ancak salona çıkıp bakınca görülüyor",
    ],
    builds: [
      "Müşterinin telefonuyla açtığı QR menü ve sipariş ekranı",
      "Garson, mutfak ve kasa için ayrı rol ekranları",
      "Siparişi doğru istasyona yönlendiren iş akışı",
      "Menü, ürün ve fiyatları panelden yönetme",
      "Gün içi operasyonu tek bakışta gösteren canlı ekranlar",
    ],
    modules: [
      { name: "QR menü", note: "Telefonda hızlı açılan, baskı gerektirmeyen menü" },
      { name: "Sipariş akışı", note: "Masadan mutfağa otomatik yönlendirme" },
      { name: "Mutfak ekranı", note: "Sıraya giren siparişler ve durumları" },
      { name: "Kasa ekranı", note: "Hesap ve gün sonu görünümü" },
      { name: "Menü yönetimi", note: "Ürün, fiyat ve kategori panelden güncellenir" },
      { name: "Rol yönetimi", note: "Her çalışan yalnızca kendi ekranını görür" },
    ],
    adminNeeds: [
      "Menü ve fiyat güncellemeleri için yönetim paneli",
      "Gün içi siparişlerin canlı takibi",
      "Rol bazlı erişim: garson, mutfak, kasa",
      "Gün sonu özet görünümü",
    ],
    automation: [
      "Siparişin doğru istasyona otomatik yönlendirilmesi",
      "Durum değişimlerinin tüm ekranlara anında yansıması",
      "Elle taşınan fişlerin tamamen ortadan kalkması",
    ],
    relatedProjects: [
      {
        slug: "restaurant-qr-system",
        note: "Bu sektör için uçtan uca kurulan sistem",
      },
    ],
    relatedSystems: [
      "operasyon-sistemi",
      "dashboard-raporlama",
      "is-akisi-otomasyonu",
    ],
    deliverables: [
      "Çalışır durumda QR sipariş ve operasyon sistemi",
      "Garson, mutfak ve kasa ekranları",
      "Menü yönetim paneli",
      "Dokümantasyon ve temiz devir",
    ],
    avoids: [
      "POS cihazı taklidi yapan yarım çözümler",
      "İşletmenizin düzenine uymayan hazır sipariş şablonları",
      "Kullanılmayacak modüllerle şişirilmiş kapsam",
    ],
    ctaTitle: "Restoranınız için sipariş akışını netleştirin",
    ctaText:
      "Masa sayınızı, mevcut düzeninizi ve akışın sıkıştığı noktayı yazın; kapsamı beraber netleştirelim.",
    seoTitle: "Restoran QR Sipariş Sistemi",
    seoDescription:
      "Restoran ve kafeler için QR menü, sipariş yönlendirme ve rol bazlı operasyon ekranları: garson, mutfak, kasa. Panelden yönetilen, çalışır teslim edilen sipariş sistemi.",
  },
  {
    slug: "psikoloji-klinik-randevu-sistemi",
    eyebrow: "Sektör — Psikoloji & klinik",
    title: "Klinik web sitesi ve randevu talebi sistemi",
    description:
      "Güven veren bir kurumsal site, arkasında içerik ve randevu taleplerini yöneten panel. Danışan siteden yazar, talep panele düşer, içerik geliştiriciye bağımlı kalmadan güncellenir.",
    problem:
      "Klinik siteleri çoğu zaman bir kez yapılır ve donar: içerik güncellenemez, randevu talepleri telefon ve mesaj trafiğinde kaybolur, sitenin arkasında yönetilebilir hiçbir şey yoktur.",
    pains: [
      "Randevu talepleri telefon, DM ve e-posta arasında dağılıyor",
      "Uzman ve hizmet bilgileri güncellemek için geliştirici gerekiyor",
      "Blog ya da bilgilendirme içeriği eklemek külfete dönüşüyor",
      "Hangi talebin yanıtlandığı takip edilemiyor",
      "Site güven veriyor ama arkasında sistem yok",
    ],
    builds: [
      "Hızlı ve güven veren klinik web sitesi",
      "Randevu talebi akışı: siteden panele düşen başvurular",
      "Uzman, hizmet ve içerik yönetimi için admin panel",
      "Talepleri durumuyla izleyen basit iş akışı",
      "Arama motorlarına uygun semantik sayfa yapısı",
    ],
    modules: [
      { name: "Kurumsal site", note: "Uzmanlar, hizmetler ve bilgilendirme sayfaları" },
      { name: "Randevu talebi", note: "Siteden gelen başvuruların panele düşmesi" },
      { name: "İçerik yönetimi", note: "Sayfa ve yazıların panelden güncellenmesi" },
      { name: "Talep takibi", note: "Yeni, yanıtlandı, kapandı durumları" },
      { name: "Uzman profilleri", note: "Kadro ve uzmanlık alanları yönetimi" },
    ],
    adminNeeds: [
      "İçerik ve uzman bilgilerini panelden düzenleme",
      "Randevu taleplerini tek listede görme",
      "Talep durumlarını işaretleme",
      "Yetkiye göre erişim ayrımı",
    ],
    automation: [
      "Site formundan panele otomatik talep kaydı",
      "Talep durum akışının elle takip yükünü kaldırması",
      "İçerik yayınlamanın geliştirici beklemeden yapılması",
    ],
    relatedProjects: [
      {
        slug: "orva-psychology",
        note: "Bu sektör için kurulan site + panel çalışması",
      },
    ],
    relatedSystems: [
      "kurumsal-web-sitesi",
      "admin-panel",
      "is-akisi-otomasyonu",
    ],
    deliverables: [
      "Çalışır kurumsal site ve yönetim paneli",
      "Randevu talebi akışı",
      "İçerik yönetimi ekranları",
      "Dokümantasyon ve temiz devir",
    ],
    avoids: [
      "Sağlık alanında güven zedeleyen abartılı vaat dili",
      "Güncellenemeyen, donmuş vitrin siteler",
      "Kliniğin işleyişine uymayan hazır randevu kalıpları",
    ],
    ctaTitle: "Kliniğiniz için site ve randevu akışını netleştirin",
    ctaText:
      "Mevcut sitenizi, randevu trafiğinizin bugün nasıl aktığını ve nerede kaybolduğunu yazın; kapsamı beraber netleştirelim.",
    seoTitle: "Psikoloji Kliniği Web Sitesi ve Randevu Sistemi",
    seoDescription:
      "Psikoloji klinikleri ve danışmanlık merkezleri için kurumsal web sitesi, randevu talebi akışı ve içerik yönetim paneli. Geliştiriciye bağımlı kalmadan yönetilen sistem.",
  },
  {
    slug: "e-ticaret-yonetim-sistemi",
    eyebrow: "Sektör — Online satış",
    title: "E-ticaret yönetim sistemi",
    description:
      "Vitrin ve arkasındaki yönetim katmanı tek sistem: ürün kataloğu, içerik, sipariş ekranları ve görsel sayfa kurulumu. Hazır paketin sınırına takılmadan, sahip olduğunuz altyapı.",
    problem:
      "Hazır e-ticaret paketleri başlangıçta hızlıdır; ama özelleştirme sınırına gelindiğinde her değişiklik ya imkânsızdır ya da pakete karşı savaşmaktır. İşletme büyüdükçe sistem küçük kalır.",
    pains: [
      "Ürün ve kategori yapısı işin gerçeğine uymuyor",
      "Sayfa düzeni değişikliği için tema ile boğuşmak gerekiyor",
      "İçerik ekipleri her şey için teknik destek bekliyor",
      "Sipariş ve stok bilgisi farklı yerlerde yaşıyor",
      "Altyapı kiralık; veri ve akış size ait değil",
    ],
    builds: [
      "Ürün kataloğu, kategori yapısı ve hızlı vitrin sayfaları",
      "Görsel olarak kurulan, kodsuz yönetilen sayfa düzenleri",
      "Sipariş ve stok ekranları",
      "Teknik olmayan editörler için içerik yönetimi",
      "Sahip olduğunuz, büyümeye açık ürün altyapısı",
    ],
    modules: [
      { name: "Ürün & katalog", note: "Ürün, kategori ve ilişkilerin yönetimi" },
      { name: "Vitrin", note: "Hızlı, temiz müşteri sayfaları" },
      { name: "Görsel sayfa kurucu", note: "Sayfalar kodla değil görsel olarak kurulur" },
      { name: "Sipariş ekranları", note: "Siparişlerin panelden takibi" },
      { name: "İçerik yönetimi", note: "Metin ve görsellerin panelden güncellenmesi" },
      { name: "Rol & yetki", note: "Editör ve yönetici ayrımı" },
    ],
    adminNeeds: [
      "Ürün ve fiyat yönetimi için hızlı panel ekranları",
      "Sipariş listesi ve durum takibi",
      "İçerik editörleri için ayrı yetki alanı",
      "Vitrinle panel arasında tutarlı veri",
    ],
    automation: [
      "Ürün verisinin vitrine otomatik yansıması",
      "Sipariş kayıtlarının tek akışta toplanması",
      "Tekrarlayan içerik işlerinin panele taşınması",
    ],
    relatedProjects: [
      {
        slug: "ecommerce-cms",
        note: "Bu sektör için kurulan ürün altyapısı",
      },
    ],
    relatedSystems: ["e-ticaret-sistemi", "admin-panel", "dashboard-raporlama"],
    deliverables: [
      "Çalışır e-ticaret altyapısı: vitrin + panel",
      "Ürün, sipariş ve içerik ekranları",
      "Görsel sayfa kurulum sistemi",
      "Dokümantasyon ve temiz devir",
    ],
    avoids: [
      "Hazır paket üstüne yama çözümler",
      "İhtiyacın ötesinde marketplace fantezileri",
      "Sahipliği size ait olmayan kiralık altyapılar",
    ],
    ctaTitle: "Satış altyapınızı kendi sisteminize taşıyın",
    ctaText:
      "Bugün hangi platformdasınız, nerede sınıra takıldınız? Yazın; kapsamı beraber netleştirelim.",
    seoTitle: "E-Ticaret Yönetim Sistemi",
    seoDescription:
      "Online satış yapan işletmeler için sahip olduğunuz e-ticaret altyapısı: ürün kataloğu, vitrin, sipariş ekranları, içerik yönetimi ve görsel sayfa kurucu tek sistemde.",
  },
  {
    slug: "operasyon-dashboard-sistemi",
    eyebrow: "Sektör — Operasyon yöneten işletmeler",
    title: "Operasyon dashboard sistemi",
    description:
      "İşin anlık durumunu tek bakışta gösteren canlı ekranlar: siparişler, talepler, görevler ve durumlar. Telefonla sorup öğrenmek yerine, ekrana bakıp bilmek.",
    problem:
      "Birden çok kişinin yürüttüğü işlerde durum bilgisi kişilerin aklında yaşar. Yönetici işin nerede olduğunu sormak zorundadır; cevaplar geç, eksik ya da çelişkili gelir.",
    pains: [
      "İşin durumu ancak telefonla sorularak öğreniliyor",
      "Aynı bilgi farklı kişilerde farklı görünüyor",
      "Gün sonu tablosu elle derleniyor",
      "Hangi işin beklediği, hangisinin bittiği belirsiz",
      "Veri var ama tek bakışta görünen bir ekran yok",
    ],
    builds: [
      "Role göre tasarlanmış canlı operasyon ekranları",
      "Durum akışları: bekleyen, işlemde, tamamlanan",
      "Liste, filtre ve arama ile hızlı erişim",
      "Gün sonu ve dönem özet görünümleri",
      "Operasyon verisini tek kaynakta toplayan altyapı",
    ],
    modules: [
      { name: "Canlı durum ekranı", note: "İşin anlık tablosu, rol bazlı" },
      { name: "İş listeleri", note: "Filtrelenebilir, aranabilir kayıtlar" },
      { name: "Durum akışı", note: "Kayıtların yaşam döngüsü takibi" },
      { name: "Özet görünümler", note: "Gün sonu ve dönem özetleri" },
      { name: "Yetki katmanı", note: "Kim neyi görür, kim neyi değiştirir" },
    ],
    adminNeeds: [
      "Role özel dashboard ekranları",
      "Kayıtları durumuyla yönetme",
      "Filtre ve arama ile hızlı erişim",
      "Elle rapor derlemeyi kaldıran özetler",
    ],
    automation: [
      "Durum değişimlerinin ilgili ekranlara anında yansıması",
      "Elle derlenen gün sonu tablolarının otomatikleşmesi",
      "Tek kaynaktan beslenen tutarlı görünümler",
    ],
    relatedProjects: [
      {
        slug: "restaurant-qr-system",
        note: "Çok rollü canlı operasyon ekranlarıyla ilgili çalışma",
      },
      {
        slug: "log-management-platform",
        note: "Kayıt toplama ve inceleme ekranlarında benzer yapı",
      },
    ],
    relatedSystems: ["dashboard-raporlama", "operasyon-sistemi", "admin-panel"],
    deliverables: [
      "Çalışır dashboard ve operasyon ekranları",
      "Durum akışlı kayıt yönetimi",
      "Rol bazlı erişim",
      "Dokümantasyon ve temiz devir",
    ],
    avoids: [
      "Bakılmayan grafiklerle dolu gösteriş panoları",
      "İş akışına oturmayan hazır dashboard şablonları",
      "Veriyi dağıtan, tek kaynağı bozan ek araçlar",
    ],
    ctaTitle: "Operasyonunuzu tek ekranda görün",
    ctaText:
      "Bugün neyi telefonla sorarak öğreniyorsunuz? Yazın; hangi ekranların gerektiğini beraber netleştirelim.",
    seoTitle: "Operasyon Dashboard Sistemi",
    seoDescription:
      "Operasyon yürüten işletmeler için canlı durum ekranları, iş listeleri ve rol bazlı dashboard sistemi. İşin anlık durumu sormadan, tek bakışta görünür.",
  },
  {
    slug: "guvenlik-log-yonetimi",
    eyebrow: "Sektör — Güvenlik & BT ekipleri",
    title: "Güvenlik log yönetimi",
    description:
      "Dağınık sistem kayıtlarını tek yerde toplayan, saklayan ve incelenebilir kılan altyapı: toplama, depolama, inceleme ekranları ve gözden geçirme akışı.",
    problem:
      "Loglar farklı sistemlerde, farklı formatlarda birikir. Bir olay yaşandığında kayıt aramak saatler alır; düzenli gözden geçirme ise hiç yapılmaz çünkü pratik bir ekran yoktur.",
    pains: [
      "Kayıtlar birden çok sistemde dağınık duruyor",
      "Olay sonrası iz sürmek saatler alıyor",
      "Düzenli log incelemesi pratik olarak yapılamıyor",
      "Kim neyi inceledi, takip edilemiyor",
      "Saklama ve erişim kuralları belirsiz",
    ],
    builds: [
      "Log toplama ve tek kaynakta depolama altyapısı",
      "Arama ve filtreleme ile hızlı inceleme ekranları",
      "Gözden geçirme iş akışı: incelendi, işaretlendi, kapatıldı",
      "Erişim ve yetki katmanı",
      "Operasyonel özet görünümleri",
    ],
    modules: [
      { name: "Toplama katmanı", note: "Kayıtların tek kaynakta birikmesi" },
      { name: "Depolama", note: "Yapılandırılmış, sorgulanabilir saklama" },
      { name: "İnceleme ekranı", note: "Arama, filtre ve detay görünümü" },
      { name: "Gözden geçirme akışı", note: "İnceleme durumlarının takibi" },
      { name: "Yetki katmanı", note: "Hassas kayıtlara rol bazlı erişim" },
    ],
    adminNeeds: [
      "İnceleme ekranlarında hızlı arama ve filtre",
      "Gözden geçirme durumlarını işaretleme",
      "Rol bazlı erişim ayrımı",
      "Özet ve durum görünümleri",
    ],
    automation: [
      "Kayıtların elle toplanmadan tek yerde birikmesi",
      "İnceleme akışının durum bazlı ilerlemesi",
      "Tekrarlayan tarama işlerinin ekrana taşınması",
    ],
    relatedProjects: [
      {
        slug: "log-management-platform",
        note: "Bu alanda geliştirilen iç ürün altyapısı — çalışır modüller",
      },
    ],
    relatedSystems: ["dashboard-raporlama", "admin-panel", "operasyon-sistemi"],
    deliverables: [
      "Çalışır log toplama ve inceleme altyapısı",
      "Gözden geçirme iş akışı ekranları",
      "Rol bazlı erişim yapısı",
      "Dokümantasyon ve temiz devir",
    ],
    avoids: [
      "Kurumsal SIEM taklidi iddialı paketler",
      "İncelenmeyen veri yığınları biriktiren kurulumlar",
      "Ekibin kullanmayacağı karmaşık arayüzler",
    ],
    ctaTitle: "Log akışınızı incelenebilir hale getirin",
    ctaText:
      "Hangi sistemlerin kaydını topluyorsunuz, olay anında neye bakamıyorsunuz? Yazın; kapsamı beraber netleştirelim.",
    seoTitle: "Güvenlik Log Yönetim Sistemi",
    seoDescription:
      "BT ve güvenlik ekipleri için log toplama, depolama ve inceleme altyapısı: arama, filtreleme, gözden geçirme iş akışı ve rol bazlı erişim tek sistemde.",
  },
  {
    slug: "uyelik-platformu",
    eyebrow: "Sektör — Üyelik & topluluk",
    title: "Üyelik platformu",
    description:
      "Üye hesapları, içerik erişimi ve üyelere yayınlama akışı: kayıttan içerik teslimine, panelden yönetilen üyelik altyapısı.",
    problem:
      "Üyeliğe dayalı işler çoğu zaman mesaj grupları ve elle tutulan listelerle yürür. Kimin üye olduğu, kimin neye erişeceği ve içeriğin üyelere nasıl ulaşacağı sistematik değildir.",
    pains: [
      "Üye listesi tablolarda ve mesaj uygulamalarında yaşıyor",
      "İçerik üyelere elle, tek tek ulaştırılıyor",
      "Kimin erişiminin aktif olduğu belirsiz",
      "Üye kaydı ve yenileme takibi el emeği istiyor",
      "Büyüdükçe yönetim yükü doğrusal artıyor",
    ],
    builds: [
      "Üye hesapları ve erişim yönetimi",
      "Üyelere içerik/kayıt yayınlama akışı",
      "Üyelik durumlarını izleyen panel ekranları",
      "Kayıt ve erişim kurallarının sistemleşmesi",
      "Büyümeyle yönetim yükünü ayrıştıran altyapı",
    ],
    modules: [
      { name: "Üye hesapları", note: "Kayıt, giriş ve hesap durumu" },
      { name: "Erişim yönetimi", note: "Kim neye, ne zamana kadar erişir" },
      { name: "Yayınlama akışı", note: "İçeriğin üyelere sistemli teslimi" },
      { name: "Üyelik paneli", note: "Üye listesi ve durum takibi" },
    ],
    adminNeeds: [
      "Üye listesi ve durum ekranları",
      "Erişim sürelerinin takibi",
      "Yayın akışının panelden yönetimi",
      "Yetki ayrımı",
    ],
    automation: [
      "Üyelere yayının elle dağıtım olmadan ulaşması",
      "Erişim durumlarının kurala bağlı işlemesi",
      "Elle liste tutmanın ortadan kalkması",
    ],
    relatedProjects: [
      {
        slug: "cendovar",
        note: "Üyelik ve yayınlama altyapısında önceki ürün çalışması",
      },
    ],
    relatedSystems: ["is-akisi-otomasyonu", "admin-panel"],
    deliverables: [
      "Çalışır üyelik ve erişim altyapısı",
      "Yayınlama akışı",
      "Üyelik yönetim paneli",
      "Dokümantasyon ve temiz devir",
    ],
    avoids: [
      "Topluluk platformu klonlama fantezileri",
      "İhtiyaç yokken kurulan karmaşık abonelik sistemleri",
      "Elle yönetime geri düşen yarım otomasyonlar",
    ],
    ctaTitle: "Üyelik akışınızı sisteme taşıyın",
    ctaText:
      "Üyeleriniz bugün nasıl kaydoluyor, içerik onlara nasıl ulaşıyor? Yazın; kapsamı beraber netleştirelim.",
    seoTitle: "Üyelik Platformu Geliştirme",
    seoDescription:
      "Üyeliğe dayalı işler için üye hesapları, erişim yönetimi ve üyelere yayınlama akışı: elle tutulan listeler yerine panelden yönetilen üyelik platformu.",
  },
];

export function getSector(slug: string): Sector | undefined {
  return sectors.find((s) => s.slug === slug);
}
