'use client';

// ══════════════════════════════════════════════════════════════
// HAKIKU — Halaman Beranda (Landing)
// src/app/page.tsx
// ══════════════════════════════════════════════════════════════

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';

const STATS = [
  { num: '90%',  label: 'kreator belum\npunya HAKI' },
  { num: '27 Jt', label: 'tenaga kerja\nekraf Indonesia' },
  { num: 'Rp 0', label: 'biaya mulai\nkonsultasi AI' },
];

const HOW_STEPS = [
  { step: '1', title: 'Diagnosis',     sub: 'AI analisis jenis HAKI yang tepat' },
  { step: '2', title: 'Cek Database',  sub: 'Deteksi kemiripan di PDKI DJKI' },
  { step: '3', title: 'Siapkan Dokumen',   sub: 'Panduan dokumen lengkap langkah demi langkah' },
  { step: '4', title: 'Daftar DJKI',   sub: 'Daftarkan & ikuti 10 langkah resmi' },
];

const TESTIMONIALS = [
  {
    initial: 'S',
    gradient: 'linear-gradient(135deg,#1B4FD8,#F97316)',
    name: 'Sari — BatikSari Studio',
    location: 'Pekalongan · Pengrajin Batik Kontemporer',
    text: '"Motif batik saya berhasil terdaftar Hak Cipta hanya 5 hari pakai HAKIKU. Panduannya sangat jelas dan AI-nya bisa jawab pertanyaan saya kapan saja!"',
  },
  {
    initial: 'R',
    gradient: 'linear-gradient(135deg,#059669,#34D399)',
    name: 'Reza — Kreator Digital Bandung',
    location: 'Bandung · Ilustrator & Desainer Grafis',
    text: '"Fitur cek database membuat saya tahu logo aman sebelum bayar biaya pendaftaran. Hemat waktu dan terhindar dari risiko penolakan!"',
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />

      <main className="flex-1 screen-container">
        {/* ── Hero ─────────────────────────────────────────── */}
        <div className="hero-section">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3"
                  style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.9)' }}>
              🏆 Platform HAKI Terpercaya 2026
            </span>

            <h1 className="font-display text-2xl text-white leading-snug mb-2">
              Daftarkan HAKI Anda<br/>
              <span style={{ color: '#FED7AA' }}>Lebih Cerdas & Pasti!</span>
            </h1>

            <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Platform konsultasi HAKI berbasis AI untuk pelaku UMKM dan kreator Indonesia.
              Mudah, terjangkau, dan sudah terbukti membantu.
            </p>
          </div>
        </div>

        {/* ── Trust Bar ──────────────────────────────────────── */}
        <div className="flex gap-3 px-4 py-2 overflow-x-auto scroll-x-hidden border-b border-slate-200"
             style={{ background: 'linear-gradient(90deg, #EFF6FF, #FFF7ED)' }}>
          {['Terintegrasi DJKI Resmi', 'Didukung Kemenekraf', 'Mitra PIDI BI-OJK 2026', 'PP No. 45/2024'].map(t => (
            <div key={t} className="flex items-center gap-1.5 flex-shrink-0 bg-white px-2.5 py-1 rounded-full border border-slate-200">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-slate-600 whitespace-nowrap">{t}</span>
            </div>
          ))}
        </div>

        {/* ── Stats ──────────────────────────────────────────── */}
        <div className="px-4 pt-4 pb-0">
          <div className="grid grid-cols-3 gap-2">
            {STATS.map(({ num, label }) => (
              <div key={num} className="bg-white border border-slate-200 rounded-xl p-3 text-center"
                   style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div className="font-display text-xl font-black text-gradient">{num}</div>
                <div className="text-[10px] text-slate-500 font-semibold leading-tight mt-1 whitespace-pre-line">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── How It Works ───────────────────────────────────── */}
        <div className="px-4 pt-4 pb-0">
          <p className="sect-label">Cara Kerja HAKIKU</p>
          <div className="flex relative">
            <div className="absolute top-5 left-5 right-5 h-0.5"
                 style={{ background: 'linear-gradient(90deg, #1B4FD8, #F97316)' }} />
            {HOW_STEPS.map(({ step, title, sub }) => (
              <div key={step} className="flex-1 flex flex-col items-center relative z-10">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-display text-base font-black text-white mb-2"
                     style={{ background: 'linear-gradient(135deg, #1B4FD8, #F97316)', boxShadow: '0 4px 12px rgba(27,79,216,0.3)' }}>
                  {step}
                </div>
                <div className="text-[11px] font-extrabold text-slate-800 text-center mb-0.5">{title}</div>
                <div className="text-[10px] text-slate-500 text-center leading-tight">{sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Persona Cards ──────────────────────────────────── */}
        <div className="px-4 pt-4 pb-0">
          <p className="sect-label">Pilih Kategori Karya Anda</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: '🪡', label: 'Kriya &\nKerajinan' },
              { icon: '🎨', label: 'Desain Grafis\n& Visual' },
              { icon: '💡', label: 'Saya Belum\nYakin' },
            ].map(({ icon, label }) => (
              <Link key={label} href="/diagnosis"
                    className="bg-white border border-slate-200 rounded-xl py-3 px-2 text-center transition-all duration-200 hover:border-blue-400 hover:shadow-brand hover:-translate-y-0.5 group relative overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                     style={{ background: 'linear-gradient(135deg, #EFF6FF, #FFF7ED)' }} />
                <span className="text-2xl block mb-1.5 relative z-10">{icon}</span>
                <span className="text-[11px] font-extrabold text-slate-800 relative z-10 whitespace-pre-line leading-tight block">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── CTAs ───────────────────────────────────────────── */}
        <div className="px-4 pt-4 pb-0">
          <Link href="/diagnosis" className="btn-blue mb-2">
            🔍 Mulai Diagnosis HAKI Gratis
          </Link>
          <Link href="/edukasi" className="btn-outline">
            📚 Pelajari Jenis HAKI Dulu
          </Link>
        </div>

        {/* ── Testimonials ───────────────────────────────────── */}
        <div className="px-4 pt-4 pb-5">
          <p className="sect-label">Cerita Pengguna</p>
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="card">
              <p className="text-xs text-slate-500 leading-relaxed mb-3 italic">{t.text}</p>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                     style={{ background: t.gradient }}>
                  {t.initial}
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-800">{t.name}</div>
                  <div className="text-[10px] text-slate-400">{t.location}</div>
                </div>
                <div className="ml-auto flex flex-col items-end gap-0.5"><div className="text-yellow-400 text-xs">★★★★★</div><span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">✓ Terverifikasi</span></div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
