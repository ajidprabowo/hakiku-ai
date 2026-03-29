import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-6 text-center"
         style={{ background: 'linear-gradient(135deg,#EFF6FF,#FFF7ED)' }}>
      <div className="text-6xl mb-4">🔍</div>
      <h1 className="font-display text-3xl font-black text-slate-900 mb-2">404</h1>
      <p className="font-display text-lg font-bold text-slate-700 mb-1">Halaman Tidak Ditemukan</p>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">
        Halaman yang Anda cari tidak tersedia.<br/>
        Mungkin sudah dipindahkan atau alamatnya salah.
      </p>
      <Link href="/"
            className="btn-blue"
            style={{ maxWidth: 240 }}>
        🏠 Kembali ke Beranda
      </Link>
    </div>
  );
}
