/**
 * Gizlilik sayfası içeriği (Phase 33F).
 *
 * Bu sayfa hukuki bir metin şablonu değildir. İnternetten kopyalanmış bir
 * "gizlilik politikası" bu sitenin ne yaptığını anlatmaz — bu metin anlatır.
 * Her madde koddaki gerçek davranışa karşılık gelir; kod değişirse burası da
 * değişmelidir.
 *
 * Kasıtlı olarak SÖYLENMEYEN şey: "KVKK/GDPR ile tam uyumluyuz". Bu bir hukuki
 * taahhüttür ve verilemez. Sayfa, verinin bugün nasıl işlendiğini anlatır.
 */

export interface PrivacySection {
  title: string;
  body: string[];
  /** Madde listesi — varsa gövdeden sonra gelir. */
  items?: string[];
  /** Küçük, sakin bir not (koyu kutu değil). */
  note?: string;
}

export const privacyPage = {
  eyebrow: "Gizlilik",
  title: "Bu site hangi veriyi, neden işliyor",
  description:
    "Kısa ve somut: ne topluyoruz, neden topluyoruz, neyi kasıtlı olarak toplamıyoruz. Şablon metin değil — burada yazan her madde sitenin gerçek davranışıdır.",
  updated: "Son güncelleme: Temmuz 2026",

  sections: [
    {
      title: "Siteyi kim işletiyor",
      body: [
        "Menensoft, Mithat Yılmaz tarafından işletilir. Veriyle ilgili her soru, talep ve silme isteği doğrudan aşağıdaki adrese gider — arada destek ekibi ya da kuyruk yoktur.",
      ],
      items: ["E-posta: mithat.menen@gmail.com"],
    },

    {
      title: "Formlar üzerinden ne toplanıyor",
      body: [
        "Siteyi gezmek için hiçbir şey vermeniz gerekmez. Yalnızca bir form gönderirseniz — /teklif-al, /iletisim ya da bunların İngilizce karşılıkları — şunlar kaydedilir:",
      ],
      items: [
        "Adınız",
        "E-posta adresiniz",
        "Telefon / WhatsApp numaranız (yazdıysanız — isteğe bağlıdır)",
        "Mesajınız (gönderdiğiniz hâliyle; düzenlediğiniz metin neyse o)",
        "Seçtiğiniz sistem türü ve mevcut durum (sihirbazı kullandıysanız)",
        "Referans aldığınız proje (bir proje sayfasından geldiyseniz)",
        "Formu gönderdiğiniz sayfa ve sayfanın dili",
        "Cihaz türü (mobil / tablet / masaüstü — tarayıcınızın gönderdiği bilgiden türetilir)",
        "Ülke kodu (yalnızca sunucu sağlayıcısı bu bilgiyi iletiyorsa; iletmiyorsa boş kalır)",
        "Gönderim zamanı",
      ],
      note: "Ham IP adresiniz saklanmaz. Veritabanında böyle bir sütun yoktur.",
    },

    {
      title: "Form verisi neden toplanıyor",
      body: [
        "Tek sebebi size dönebilmek ve talebinizi değerlendirebilmek. Mesajınız doğrudan kurucuya düşer.",
        "Bu veri satılmaz, reklam ağlarıyla paylaşılmaz, pazarlama listesine eklenmez. Size yalnızca yazdığınız konuda dönülür.",
      ],
    },

    {
      title: "Analitik",
      body: [
        "Bu sitede Google Analytics yoktur. Hiçbir üçüncü taraf izleme script'i yoktur. Ziyaretçi verisi yalnızca bu sitenin kendi sunucusunda, kendi veritabanında tutulur.",
        "Ziyaretçi kimliği tarayıcınızda değil, sunucuda hesaplanır: günlük değişen bir gizli değer, IP adresiniz ve tarayıcı bilgileriniz birlikte tek yönlü bir özete (hash) çevrilir. IP adresi yalnızca bu hesaplama sırasında bellekte bulunur ve hiçbir yere yazılmaz.",
        "Gizli değer her gün değiştiği için, dünkü kimliğinizle bugünkü kimliğiniz eşleşmez. Sizi günler boyunca takip etmek teknik olarak mümkün değildir — bu bir söz değil, tasarımın sonucudur.",
      ],
      items: [
        "Analitik için çerez kullanılmaz.",
        "Analitik için localStorage'a kimlik yazılmaz.",
        "Parmak izi (fingerprinting) yapılmaz.",
        "Ham IP adresi saklanmaz.",
        "Yönlendiren sitenin yalnızca alan adı tutulur, tam adres değil — tam adres arama sorgunuzu ya da özel bir sayfayı taşıyabilir.",
        "Tarayıcınızda 'Do Not Track' ya da 'Global Privacy Control' açıksa hiçbir olay kaydedilmez.",
        "Botlar ve tarayıcı robotları kayda alınmaz.",
      ],
      note: "Sitede geçirilen süreler yaklaşıktır: son baktığınız sayfada ne kadar kaldığınız ölçülemez. Panelde görünen sayılar gerçek trafiğin bir alt kümesidir.",
    },

    {
      title: "Form ile site oturumunun eşleştirilmesi",
      body: [
        "Bir form gönderdiğinizde, o gönderim aynı günkü anonim site oturumunuzla eşleştirilebilir. Yani yönetim paneli, formu göndermeden önce hangi sayfalara baktığınızı gönderdiğiniz mesajla birlikte görebilir.",
        "Bu eşleştirme tamamen sunucuda yapılır. Tarayıcınıza hiçbir kimlik verilmez; tarayıcınız zaten bir kimlik taşımaz ve göndermek istese de gönderemez. Eşleştirme, yukarıda anlatılan aynı günlük özet (hash) yeniden hesaplanarak yapılır.",
        "Açık olalım: bu, önceki durumdan bir adım ileridir. Daha önce 'bu iki kayıt hiçbir zaman birleştirilmez' diyorduk; artık birleştiriliyor. Bunu sonradan sessizce değiştirmek yerine burada yazıyoruz.",
      ],
      items: [
        "Hâlâ ham IP adresi saklanmaz.",
        "Hâlâ çerez kullanılmaz.",
        "Hâlâ localStorage'a analitik kimliği yazılmaz.",
        "Hâlâ günler arası takip yapılmaz — eşleşme yalnızca aynı gün içinde mümkündür, çünkü gizli değer her gün değişir.",
        "Tarayıcınız hiçbir analitik kimliği almaz.",
        "Eşleşme bulunamazsa (analitik kapalıysa, DNT/GPC kullanıyorsanız ya da oturum penceresi kapandıysa) lead yine kaydedilir; sadece oturum bağlantısı boş kalır.",
      ],
      note: "Neden yapıyoruz: hangi sayfaların gerçekten iş getirdiğini görebilmek için. Ziyaretçi sayısı değil, hangi içeriğin işe yaradığı önemli.",
    },

    {
      title: "Bu veriyi kim görüyor",
      body: [
        "Gönderdiğiniz mesajlar ve analitik özetleri yalnızca site sahibinin parola korumalı yönetim panelinde görünür. Panel arama motorlarına kapalıdır ve sitede hiçbir yerden bağlantı verilmez.",
        "Veri üçüncü taraflarla paylaşılmaz. Sunucu ve veritabanı barındırma sağlayıcıları dışında kimse erişemez.",
      ],
    },

    {
      title: "Ne kadar süre saklanıyor",
      body: [
        "Form mesajları bir iş yazışması kaydıdır ve siz silinmesini isteyene ya da artık gerekli olmayana kadar saklanır.",
        "Analitik kayıtları için hedeflenen süre 12 aydır.",
      ],
      note: "Dürüst olmak gerekirse: otomatik silme henüz kurulmadı. Silme, talep üzerine elle yapılır. Kurulmamış bir otomasyonu var gibi göstermektense bunu yazmayı tercih ediyoruz.",
    },

    {
      title: "Seçenekleriniz",
      body: [
        "Form kullanmak zorunda değilsiniz: e-posta ya da WhatsApp ile doğrudan yazabilirsiniz. İkisi de aynı yere ulaşır.",
        "Gönderdiğiniz bir mesajın silinmesini ya da düzeltilmesini istiyorsanız, aynı adresten yazmanız yeterli. Kimlik doğrulama süreci ya da form doldurma yoktur.",
        "Tarayıcınızda Do Not Track / Global Privacy Control açarsanız analitik olaylarınız hiç kaydedilmez.",
      ],
    },

    {
      title: "Çerezler ve tarayıcı depolaması",
      body: [
        "Bu sitede pazarlama çerezi ya da analitik çerezi yoktur. Bu yüzden bir çerez onay penceresi de yoktur — onaylanacak bir şey yok.",
      ],
      items: [
        "Analitik: çerez yok, localStorage kimliği yok.",
        "Dil önerisi: dil önerisini kapatırsanız ya da dil seçerseniz, bu tercih tarayıcınızda saklanır — yalnızca size aynı öneriyi tekrar tekrar göstermemek için. Bu bir kimlik değildir ve sunucuya gönderilmez.",
        "Sihirbaz taslağı: /teklif-al sayfasında yazdığınız mesaj, sekmeyi kapatana kadar tarayıcınızda tutulur — yanlışlıkla geri gidip yazdıklarınızı kaybetmeyin diye. Sunucuya gönderilmez.",
        "Kampanya paneli: Paneli kapatırsanız, aynı oturumda tekrar göstermemek için tarayıcınızda küçük bir işaret tutulur. Bu bir kimlik değildir ve sunucuya gönderilmez.",
        "Yönetim girişi: yalnızca site sahibinin panele girmesi için güvenli bir oturum çerezi kullanılır. Ziyaretçiler bu çerezi hiç almaz.",
      ],
    },

    {
      title: "Bu sayfanın sınırı",
      body: [
        "Bu metin, sitenin bugünkü veri işleme davranışını anlatır. Hukuki bir mütalaa değildir ve tam KVKK/GDPR uyumluluğunu taahhüt etmez — bunu ancak bir hukukçu değerlendirebilir.",
        "Uygulama değişirse bu sayfa da değişir. Bir sorunuz varsa yazın; cevaplamak için form doldurmanız gerekmez.",
      ],
    },
  ] satisfies PrivacySection[],
};
