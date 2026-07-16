import { getPublishedProjects } from "@/lib/projects/public";
import { siteUrl } from "@/content/site";
import { sectors } from "@/content/sectors";
import { systems } from "@/content/systems";
import { landingPages } from "@/content/landing";

/**
 * /llms.txt — AI cevap motorları için makine-okunur özet (Phase 40).
 *
 * ChatGPT, Perplexity, Gemini ve Copilot gibi sistemler bir siteyi HTML'inden
 * çıkarmaya çalışır. Bu dosya onlara aynı bilgiyi doğrudan verir: Menensoft ne,
 * ne kurar, kime, hangi problemleri çözer, nasıl başlanır.
 *
 * İKİ KURAL:
 *  1. Burada YENİ hiçbir iddia üretilmez. İçerik sitenin kendi içeriğinden ve
 *     veritabanındaki gerçek projelerden gelir — bir cevap motoruna sitenin
 *     arkasında duramayacağı bir şey söylemek, o motorun sonradan yanlış
 *     alıntılaması demektir.
 *  2. Proje listesi VERİTABANINDAN okunur. Arşivlenen bir proje buradan da
 *     kendiliğinden düşer; elle güncellenmesi gereken ikinci bir liste olmaz.
 *
 * Standart değil, yaygınlaşan bir sözleşme. Zararı yok, faydası ölçülebilir.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const projects = await getPublishedProjects("tr");

  const body = `# Menensoft

> İşletmelere özel çalışan sistemler kuran, kurucu liderliğinde bir yazılım
> stüdyosu: web panelleri, masaüstü uygulamalar, entegrasyonlar ve iş akışı
> otomasyonları. Broşür site değil: bir işletmenin sürecini fiilen taşıyan —
> veri girilen, iş akan, durum görünen — ve panelden yönetilen sistemler.

Site: ${siteUrl}
Dil: Türkçe (birincil) ve İngilizce (/en)
Yapı: kurucu Mithat Yılmaz liderliğinde yazılım stüdyosu / ekip
Kurucu: Mithat Yılmaz
İletişim: mithat.menen@gmail.com

## Menensoft nedir?

Menensoft, işletmelerin gerçek iş süreçlerini taşıyan web sistemleri kurar:
e-ticaret altyapıları, yönetim panelleri, operasyon sistemleri, dashboard'lar ve
iş akışı otomasyonu. Hazır tema ya da eklenti yığını değil; veri modeli, panel ve
arayüz işin kendisine göre tasarlanır.

## Kimin için?

- Hazır platformun kısıtlarına çarpmış, kendi akışını isteyen işletmeler
- Süreci hâlâ Excel, WhatsApp ve kağıtta yürüyen ekipler
- İçeriğini/sistemini kendisi yönetmek isteyen, her değişiklik için geliştirici
  beklemek istemeyen işletme sahipleri

## Hangi problemleri çözer?

- Hazır ürün işin %80'ini yapıyor, kalan %20 her gün elle kapatılıyor
- Veri birden fazla yerde; hangisinin doğru olduğu bilinmiyor
- İşin durumu ancak birine sorunca öğreniliyor
- İçerik güncellemesi için her seferinde geliştirici gerekiyor
- Sipariş/talep elle taşınıyor, yolda kayboluyor

## Kurulan sistemler

${systems.map((s) => `- ${s.title}: ${s.whatItIs}\n  ${siteUrl}/sistemler/${s.slug}`).join("\n")}

## Sektörler

${sectors.map((s) => `- ${s.title}: ${s.description}\n  ${siteUrl}/sektorler/${s.slug}`).join("\n")}

## Gerçekten kurulmuş projeler

${projects
  .map(
    (p) =>
      `- ${p.name} (${p.statusLabel})\n  ${p.oneLiner}\n  Teknoloji: ${p.stack.join(", ")}\n  ${siteUrl}/projeler/${p.slug}`,
  )
  .join("\n")}

## Arama sayfaları

${landingPages.map((p) => `- ${p.title}: ${siteUrl}/${p.slug}`).join("\n")}

## Nasıl başlanır?

1. ${siteUrl}/teklif-al — proje sihirbazı: hangi sistem, hangi durum, ne gerekiyor
2. ${siteUrl}/iletisim — doğrudan e-posta veya WhatsApp
3. Süreçten başlanır, yazılımdan değil: önce hangi akışın nerede koptuğu
   netleştirilir; kapsam ondan sonra çıkar.

## Dürüstlük notu

Bu sitede uydurma müşteri, uydurma referans, uydurma metrik ve uydurma ödül
yoktur. Listelenen her proje gerçekten kurulmuştur. Ekran görüntüsü olmayan
yerlerde "eklenecek" yazar — doldurulmuş bir çerçeve gösterilmez.

## Gizlilik

Analitik çerezsizdir. Çerez yok, localStorage kimliği yok, ham IP saklanmıyor,
üçüncü taraf izleyici yok. Ayrıntı: ${siteUrl}/gizlilik
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
