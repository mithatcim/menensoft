/**
 * /teklif-al proje-uyum sihirbazının içeriği. İki kısa soru + dürüst bir
 * öneri: sabit paket, fiyat, süre ya da sonuç vaadi yok. Öneriler yalnızca
 * gerçekten var olan sistem/sektör sayfalarına bağlanır.
 */

export interface FitSystemOption {
  id: string;
  label: string;
  hint: string;
  /** İlgili /sistemler sayfası; "emin değilim" için boş. */
  systemSlug?: string;
  /** Gerçekten uyan bir sektör örneği varsa /sektorler sayfası. */
  sectorSlug?: string;
  /** Öneri kartındaki kısa açıklama. */
  recText?: string;
}

export const fitSystems: FitSystemOption[] = [
  {
    id: "e-ticaret",
    label: "E-ticaret sistemi",
    hint: "Vitrin + yönetim paneli + sipariş",
    systemSlug: "e-ticaret-sistemi",
    sectorSlug: "e-ticaret-yonetim-sistemi",
    recText:
      "Vitrin ve yönetim katmanı tek altyapıda: hazır paketin sınırı yerine sahip olduğunuz bir sistem. İlk görüşmede bugünkü platformunuz ve ürün yapınız konuşulur.",
  },
  {
    id: "yonetim-paneli",
    label: "Yönetim paneli",
    hint: "Veri, roller, iç ekranlar",
    systemSlug: "admin-panel",
    recText:
      "Tablolarda ve mesajlarda yaşayan veri, rol bazlı yetkili ekranlara taşınır. İlk görüşmede hangi verinin nerede yönetildiği konuşulur.",
  },
  {
    id: "kurumsal-site",
    label: "Kurumsal site + admin panel",
    hint: "Panelden yönetilen, talep toplayan site",
    systemSlug: "kurumsal-web-sitesi",
    sectorSlug: "psikoloji-klinik-randevu-sistemi",
    recText:
      "Donmuş vitrin yerine panelden güncellenen, talepleri sistemde toplayan bir site. İlk görüşmede mevcut sitenizin neyi yapamadığı konuşulur.",
  },
  {
    id: "dashboard",
    label: "Dashboard / raporlama",
    hint: "Canlı durum ve özetler",
    systemSlug: "dashboard-raporlama",
    sectorSlug: "operasyon-dashboard-sistemi",
    recText:
      "İşin anlık durumu sormadan, tek bakışta görünür hale gelir. İlk görüşmede bugün neyi göremediğiniz konuşulur.",
  },
  {
    id: "otomasyon",
    label: "İş akışı otomasyonu",
    hint: "Manuel işin yazılıma taşınması",
    systemSlug: "is-akisi-otomasyonu",
    recText:
      "Elle dönen akış kaynağında bir kez yakalanır, kurala göre yönlenir. İlk görüşmede mevcut süreç olduğu gibi haritalanır.",
  },
  {
    id: "operasyon",
    label: "Operasyon sistemi",
    hint: "Çok rollü istasyon ekranları",
    systemSlug: "operasyon-sistemi",
    sectorSlug: "restoran-qr-siparis-sistemi",
    recText:
      "Tek girdi her istasyona kendi ekranıyla ulaşır; durum herkes için aynıdır. İlk görüşmede işinizin geçtiği istasyonlar konuşulur.",
  },
  {
    id: "emin-degilim",
    label: "Emin değilim",
    hint: "Birlikte netleştirelim",
  },
];

export interface FitSituation {
  id: string;
  label: string;
}

export const fitSituations: FitSituation[] = [
  { id: "sifirdan", label: "Sıfırdan yeni sistem gerekiyor" },
  { id: "yetersiz", label: "Mevcut site/panel yetersiz kalıyor" },
  { id: "manuel", label: "İşler Excel/WhatsApp ile manuel takip ediliyor" },
  { id: "platform", label: "Hazır platformdan özel sisteme geçmek istiyorum" },
  { id: "fikir", label: "Bir fikri çalışır ürüne çevirmek istiyorum" },
  { id: "toparlama", label: "Mevcut sistemi düzenlemek istiyorum" },
];

export interface FitRecommendation {
  label: string;
  text: string;
  systemSlug?: string;
  sectorSlug?: string;
}

/**
 * "Emin değilim" seçildiğinde öneri mevcut duruma göre belirlenir.
 * Somut bir sistem türü dayatmak dürüst olmayacaksa görüşme önerilir.
 */
export const unsureRecommendations: Record<string, FitRecommendation> = {
  sifirdan: {
    label: "Kapsam görüşmesi + çözüm haritası",
    text: "Sıfırdan başlarken ilk iş tür seçmek değil, iş akışını haritalamak. Kısa bir görüşmede ihtiyacın site mi, panel mi, sistem mi olduğu netleşir — önce bu netleşir, sonra çözüm önerilir.",
  },
  yetersiz: {
    label: "Site + panel yenileme görüşmesi",
    text: "Yetersiz kalan bir site çoğu zaman panel eksikliğidir: içerik güncellenemez, talepler kaybolur. Panelden yönetilen kurumsal site yapısı bu duruma birebir bakar.",
    systemSlug: "kurumsal-web-sitesi",
  },
  manuel: {
    label: "İş akışı otomasyonu",
    text: "Excel ve mesajla dönen iş, kaynağında bir kez yakalanan bir akışa taşınabilir. İlk görüşmede mevcut manuel süreç olduğu gibi haritalanır; otomasyonun sınırı birlikte çizilir.",
    systemSlug: "is-akisi-otomasyonu",
  },
  platform: {
    label: "Özel e-ticaret altyapısına geçiş",
    text: "Hazır platformun sınırına geldiyseniz, sahip olduğunuz bir altyapıya geçişin gerçekçi bir yolu konuşulur: veri, ürün yapısı ve sipariş akışı adım adım ele alınır.",
    systemSlug: "e-ticaret-sistemi",
    sectorSlug: "e-ticaret-yonetim-sistemi",
  },
  fikir: {
    label: "Ürün altyapısı görüşmesi",
    text: "Fikirden çalışır ürüne giden yol veri modeliyle başlar. İlk mesajda fikri birkaç cümleyle anlatmanız yeterli; hangi modüllerin ilk sürüme gireceği birlikte netleşir.",
  },
  toparlama: {
    label: "Yapı değerlendirme görüşmesi",
    text: "Mevcut sistemi büyütmeden önce neyin korunacağı, neyin değişeceği netleşmeli. İlk mesajda bugün neyin çalışıp neyin aksadığını yazın; dönüş dürüst bir değerlendirme olur.",
  },
};

/** Öneri çözümleme: belirli tür seçildiyse o; değilse duruma göre. */
export function resolveRecommendation(
  systemId: string,
  situationId: string,
): FitRecommendation {
  const system = fitSystems.find((s) => s.id === systemId);
  if (system && system.id !== "emin-degilim" && system.recText) {
    return {
      label: system.label,
      text: system.recText,
      systemSlug: system.systemSlug,
      sectorSlug: system.sectorSlug,
    };
  }
  return (
    unsureRecommendations[situationId] ?? {
      label: "Kapsam görüşmesi",
      text: "Durumunuzu birkaç cümleyle yazın; ihtiyacın sistem mi, site mi, panel mi olduğunu birlikte netleştirelim.",
    }
  );
}
