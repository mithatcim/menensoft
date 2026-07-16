/**
 * Menensoft ses rehberi — iç not, hiçbir sayfada render edilmez.
 * Yeni kopya yazarken veya mevcut kopyayı düzenlerken bu sınırlara uyulur.
 */

export const voice = {
  ton: [
    "Premium ama gösterişsiz; teknik olarak ciddi, satış odaklı ama dürüst.",
    "Mission-control kimliği: sistem, akış, modül, panel dili — hacker/oyun estetiği değil.",
    "Marka Menensoft 'biz' diliyle konuşur; kurucu Mithat Yılmaz görünürdür; kurucu liderliğinde bir yazılım stüdyosu/ekip olarak konumlanır — uydurma büyük ajans, çalışan sayısı veya departman imâsı yapılmaz.",
    "Alıcı sorusuna cevap veren kısa cümleler; çeviri kokan kalıplardan kaçın.",
  ],

  tercihEdilen: [
    "tamamlanmış sistem",
    "çalışır yapı / çalışır teslim",
    "teslim mantığı",
    "müşteri ihtiyacına göre geliştirilmiş",
    "yönetilebilir panel",
    "net kapsam",
    "sürdürülebilir mimari",
    "dönüşüm odaklı / teklif talebi / proje görüşmesi",
  ],

  kacinilan: [
    "garanti, kesin sonuç, en iyi, lider, dünya çapında",
    "uydurma büyük ajans / çalışan sayısı / departman / ofis adresi imâsı (küçük, kurucu liderliğindeki ekip dürüstçe anlatılır)",
    "müşteri adı, gelir, kullanıcı sayısı, canlı URL, lansman iddiası, referans/testimonial",
    "dijital çözüm / dijital dönüşüm gibi boş kalıplar",
    "oltalama/phishing sözlüğü; aciliyet, geri sayım, kıtlık numaraları",
    "SEO/sıralama vaadi — olumsuzlama cümlesinde bile 'garanti' kelimesini kullanma",
  ],

  iddiaSiniri: [
    "İçerikte olmayan hiçbir olgu uydurulmaz; emin olunmayan şey genel ifadeyle yazılır:",
    "'teslim edilmiş çalışma', 'çalışır sistem', 'müşteri ihtiyacına göre tamamlanmış yapı'.",
    "Fiyat sorulursa tek cevap: 'Fiyat, kapsam ve modüllere göre belirlenir.'",
  ],

  cta: [
    // "Teklif al" bilinçli olarak listeden çıkarıldı (Faz 24): sayfa kapsamdan
    // önce fiyat vermiyor, dolayısıyla teklif vaat eden etiket yanlış beklenti
    // kuruyordu. Rota /teklif-al olarak kalıyor; değişen yalnızca görünen metin.
    "Birincil: Proje görüşmesi başlat / Kapsamı netleştirelim / İhtiyacınızı yazın.",
    "Nav etiketi: 'Proje görüşmesi'.",
    "Sistem düzeyinde: 'Bu sistemi konuşalım'. Proje düzeyinde: projeye özel CTA.",
    "İkincil: Projeleri incele / Süreci incele / İlgili sistemi incele / Sektör örneklerini gör.",
    "'Yazın; …' kalıbını üst üste tekrarlama — kapanışları sayfaya göre çeşitlendir.",
    "Her sayfada tek birincil aksiyon: /teklif-al.",
  ],
} as const;
