/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // IGNORANDO SLINT POR ENQUANTO PRA GERAR BUILD DE BOA
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'www.free-smileys.com',
      's0.xat.com',
      'gs.xat.com',
      'images.stockcake.com',
      'upload.wikimedia.org',
      'cdn-icons-png.flaticon.com',
      'img.myloview.com.br',
      'img.myloview.com.br',
      'api.dicebear.com',
      'media2.giphy.com'
    ],
  },
  webpack(config: { resolve: { fallback: any; }; }) {
    config.resolve.fallback = {
      // if you miss it, all the other options in fallback, specified
      // by next.js will be dropped.
      ...config.resolve.fallback,

      fs: false, // the solution
    };

    return config;
  },
};

module.exports = nextConfig;
