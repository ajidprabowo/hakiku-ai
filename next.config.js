/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Aktifkan image optimization dari domain eksternal (opsional)
  images: {
    remotePatterns: [],
  },

  // ── Environment variables yang aman untuk diakses di client side
  // Variabel dengan prefix NEXT_PUBLIC_ otomatis tersedia di browser
  // Variabel tanpa prefix HANYA tersedia di server (API routes)
  env: {
    // Tidak perlu di-hardcode di sini — gunakan .env.local
  },
};

module.exports = nextConfig;
