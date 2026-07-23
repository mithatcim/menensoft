/**
 * Proje ekran görüntüsü galerileri (Phase 46).
 *
 * Gerçek üründen, sahibin çektiği ekran görüntüleri. Dosyalar
 * public/projects/<slug>/ altında yaşar; Windows filigranı yayın öncesi
 * pikselle maskelendi, müşteri verisi içermezler (boş-durum ekranları dahil —
 * onlar da gerçek ürünün parçası). Uydurma hiçbir şey yok.
 *
 * `featured` işaretliler sayfadaki ızgarada görünür; lightbox tüm kareleri
 * gezdirir.
 */

export interface GalleryItem {
  /** public/projects/<slug>/<file>.png */
  file: string;
  tr: string;
  en: string;
  featured?: boolean;
}

/**
 * Kapak görseli: galerisi olan bir proje için ilk öne çıkan kareyi BrowserFrame
 * biçiminde döndürür. command-deck önizlemesi ve proje detay hero'su, DB'de
 * image yoksa "alan ayrıldı" yerine bu gerçek kareyi gösterir.
 */
export function galleryCover(
  slug: string,
  locale: "tr" | "en" = "tr",
): { src: string; alt: string } | undefined {
  const items = projectGalleries[slug];
  if (!items?.length) return undefined;
  const cover = items.find((i) => i.featured) ?? items[0];
  return {
    src: `/projects/${slug}/${cover.file}.png`,
    alt: locale === "en" ? cover.en : cover.tr,
  };
}

export const projectGalleries: Record<string, GalleryItem[]> = {
  "ecommerce-cms": [
    { file: "site-kurucu-1", tr: "Görsel site kurucu — bölümler ve canlı önizleme", en: "Visual site builder — sections and live preview", featured: true },
    { file: "site-kurucu-2", tr: "Görsel site kurucu — bölüm düzenleme", en: "Visual site builder — section editing", featured: true },
    { file: "site-kurucu-3", tr: "Görsel site kurucu — tema ve yayınlama", en: "Visual site builder — theme and publishing", featured: true },
    { file: "panel-ana-sayfa", tr: "Panel ana sayfası", en: "Panel home", featured: true },
    { file: "urunler", tr: "Ürün yönetimi", en: "Product management", featured: true },
    { file: "siparisler", tr: "Sipariş yönetimi", en: "Order management", featured: true },
    { file: "analitik-1", tr: "Analitik — genel bakış", en: "Analytics — overview", featured: true },
    { file: "pazaryeri-1", tr: "Pazaryeri kanalları", en: "Marketplace channels", featured: true },
    { file: "fiyat-kurallari", tr: "Fiyat kuralları", en: "Pricing rules", featured: true },
    { file: "kuponlar", tr: "Kupon yönetimi", en: "Coupon management", featured: true },
    { file: "eposta-sablonlari", tr: "E-posta şablonları", en: "Email templates", featured: true },
    { file: "kargo", tr: "Kargo ayarları", en: "Shipping settings", featured: true },
    { file: "analitik-2", tr: "Analitik — ayrıntı", en: "Analytics — detail" },
    { file: "kategoriler", tr: "Kategori yönetimi", en: "Category management" },
    { file: "musteriler", tr: "Müşteri yönetimi", en: "Customer management" },
    { file: "sepetler", tr: "Sepetler", en: "Carts" },
    { file: "kullanicilar", tr: "Kullanıcılar ve roller", en: "Users and roles" },
    { file: "sablonlar", tr: "Sayfa şablonları", en: "Page templates" },
    { file: "blog", tr: "Blog yönetimi", en: "Blog management" },
    { file: "medya", tr: "Medya kütüphanesi", en: "Media library" },
    { file: "mesajlar", tr: "Mesajlar", en: "Messages" },
    { file: "pazaryeri-2", tr: "Pazaryeri kanalları — ayrıntı", en: "Marketplace channels — detail" },
    { file: "komisyonlar", tr: "Komisyonlar", en: "Commissions" },
    { file: "sync-gunlukleri", tr: "Senkronizasyon günlükleri", en: "Sync logs" },
    { file: "ham-olaylar", tr: "Ham olay akışı", en: "Raw event stream" },
    { file: "aktivite", tr: "Aktivite geçmişi", en: "Activity history" },
    { file: "odeme-tahsilat", tr: "Ödeme ve tahsilat", en: "Payments and collection" },
    { file: "eposta-form-1", tr: "E-posta ve form ayarları", en: "Email and form settings" },
    { file: "eposta-form-2", tr: "E-posta ve form ayarları — ayrıntı", en: "Email and form settings — detail" },
    { file: "ayarlar-1", tr: "Mağaza ayarları", en: "Store settings" },
    { file: "ayarlar-2", tr: "Mağaza ayarları — ayrıntı", en: "Store settings — detail" },
    { file: "kurulum-rehberi", tr: "Kurulum rehberi", en: "Setup guide" },
  ],
};
