import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Kalıcı yönlendirmeler: eski İngilizce rotalar → Türkçe kanonik rotalar.
    return [
      { source: "/projects", destination: "/projeler", permanent: true },
      {
        source: "/projects/:slug",
        destination: "/projeler/:slug",
        permanent: true,
      },
      { source: "/services", destination: "/cozumler", permanent: true },
      { source: "/about", destination: "/hakkimda", permanent: true },
      { source: "/contact", destination: "/iletisim", permanent: true },
    ];
  },
};

export default nextConfig;
