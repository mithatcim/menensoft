import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Kalıcı yönlendirmeler (308): İngilizce kelimeli eski yollar → İngilizce
    // kanonik rotalar. Bu yollar TR-only dönemde Türkçe sayfalara gidiyordu;
    // site hiç yayınlanmadığı için korunacak eski bağlantı yoktu ve /en ağacı
    // artık var. Bu yolları deneyen tek kitle İngilizce konuşan ziyaretçi ya da
    // crawler — İngilizce kelime İngilizce sayfaya gitmeli.
    //
    // Hedefler kanonik (200) rotalardır; zincir yok. Proje slug'ları iki dilde
    // birebir aynı olduğu için :slug doğrudan taşınır.
    // src/lib/routes.ts içindeki compatRedirects ile birlikte güncelle.
    return [
      { source: "/projects", destination: "/en/projects", permanent: true },
      {
        source: "/projects/:slug",
        destination: "/en/projects/:slug",
        permanent: true,
      },
      { source: "/services", destination: "/en/solutions", permanent: true },
      { source: "/about", destination: "/en/about", permanent: true },
      { source: "/contact", destination: "/en/contact", permanent: true },
    ];
  },
};

export default nextConfig;
