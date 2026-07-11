/**
 * Otorite/karşılaştırma sayfalarının içeriği (/neden-menensoft ve
 * /hazir-site-mi-ozel-sistem-mi). İkna edici ama dürüst: rakip karalama,
 * uydurma rakam, "herkese özel yazılım gerekir" saçmalığı yok. Hazır aracın
 * yeterli olduğu durumlar açıkça söylenir.
 */

export interface Pillar {
  title: string;
  body: string;
}

export const whyPillars: Pillar[] = [
  {
    title: "Net kapsam",
    body: "Geliştirme başlamadan neyin kurulacağı — ve neyin kurulmayacağı — yazılı olarak netleşir. Belirsiz iş şişirilmez, netleştirilir.",
  },
  {
    title: "Sahiplik",
    body: "Teslim edilen sistem sizindir: kod tabanı, veri modeli ve yönetim paneli. Kiralık şablonlara ve kapalı kutulara bağımlılık kalmaz.",
  },
  {
    title: "Yönetim paneli",
    body: "Her sistem yönetilebilir teslim edilir. İçerik, ürün, talep — geliştirici beklemeden panelden güncellenir.",
  },
  {
    title: "İş akışına uyum",
    body: "Sistem işinize göre ölçülür; işiniz şablona uydurulmaz. Önce mevcut akış dürüstçe haritalanır, sonra kurulur.",
  },
  {
    title: "Sürdürülebilirlik",
    body: "Küçük ve incelenebilir adımlar, temiz yapı, dokümantasyon. Sistem devirden sonra da sizinle yaşamaya devam eder.",
  },
  {
    title: "Dürüst değerlendirme",
    body: "Hazır araç yeterliyse bu açıkça söylenir. Her işe özel yazılım önermek satış değil, israftır.",
  },
];

/** "Ne değiliz" — güveni abartıyla değil sınır çizerek kuran blok. */
export const notWe = [
  "Kalabalık bir ajans değil: markanın arkasında tek kurucu-geliştirici var ve muhatabınız doğrudan o.",
  "Şablon bayisi değil: hazır tema üstüne logo değiştiren bir iş modeli yok.",
  "Her işe evet diyen bir tedarikçi değil: kapsam işe uymuyorsa açıkça söylenir.",
  "Vaat makinesi değil: burada müşteri adı, uydurma rakam ya da sıralama garantisi bulamazsınız.",
];

export const whoFits = [
  "İş akışını sisteme taşımak isteyen, muhatapla doğrudan çalışmayı seven işletmeler",
  "Panelden yönetilebilir, sahibi olduğu bir altyapı isteyenler",
  "Kapsamı net, teslimatı somut proje ilişkisi arayanlar",
  "Uzun ömürlü, devredilebilir sistem isteyen ekipler",
];

/* ------------------- hazır site mi, özel sistem mi? ------------------- */

/** Kısa, alıntılanabilir cevap — sayfanın en üstünde görünür. */
export const comparisonShortAnswer =
  "Kısa cevap: İhtiyacınız yalnızca tanıtım vitrini ise hazır site çoğu zaman yeterlidir. Sisteme taşınacak bir iş akışınız varsa — sipariş, talep, randevu, içerik yönetimi — panelden yönetilen özel bir sistem mantıklıdır.";

export const whenReadyMade = [
  "Tek ihtiyacınız birkaç sayfalık tanıtım vitrini ise",
  "İçerik nadiren değişiyorsa ve formdan gelen birkaç e-posta yetiyorsa",
  "Bütçe ve zaman çok kısıtlıysa, akışınız da standartsa",
  "Hazır platformun kurallarıyla yaşamak sizin için sorun değilse",
];

export const whenCustom = [
  "Sipariş, talep ya da randevu gibi bir iş akışı sisteme taşınacaksa",
  "İçeriği ve veriyi ekibiniz panelden yönetecekse",
  "Birden çok rol aynı veri üzerinde çalışıyorsa",
  "Hazır paketin sınırına takıldıysanız ve sahiplik istiyorsanız",
  "İşleyişin büyüyüp değişmesi bekleniyorsa",
];

export interface ComparisonDimension {
  name: string;
  ready: string;
  custom: string;
}

export const comparisonDimensions: ComparisonDimension[] = [
  {
    name: "Sahiplik",
    ready: "Altyapı platformundur; siz kiralarsınız.",
    custom: "Kod tabanı ve veri modeli sizindir.",
  },
  {
    name: "İçerik yönetimi",
    ready: "Platform panelinin izin verdiği kadar.",
    custom: "Panel, işinizin gerçek alanlarına göre tasarlanır.",
  },
  {
    name: "İş akışı uyumu",
    ready: "Akışınız şablonun kalıbına uyarlanır.",
    custom: "Sistem akışınıza göre ölçülür.",
  },
  {
    name: "Büyüme ve özelleştirme",
    ready: "Eklenti ve tema sınırları içinde kalır.",
    custom: "Modüller ihtiyaçla birlikte genişler.",
  },
  {
    name: "Maliyet yapısı",
    ready: "Düşük başlangıç; sürekli kira ve eklenti maliyeti.",
    custom: "Kapsama göre proje bedeli — fiyat, kapsam ve modüllere göre belirlenir.",
  },
  {
    name: "Bakım ve devir",
    ready: "Platforma bağımlı güncellemeler.",
    custom: "Dokümante edilmiş, devredilebilir yapı.",
  },
];

export const decisionQuestions = [
  "Sisteme taşınacak gerçek bir iş akışınız var mı?",
  "İçeriği ya da veriyi ekibiniz mi yönetecek?",
  "Önümüzdeki dönemde işleyişin büyümesi veya değişmesi bekleniyor mu?",
];

export const decisionVerdict =
  "Cevapların çoğu evet ise özel sistem görüşmeye değer. Değilse hazır araç kullanın — görüşmede ihtiyaç hazır araçla çözülüyorsa bunu açıkça söyleriz; yanlış işe özel yazılım satmak kimseye kazandırmaz.";
