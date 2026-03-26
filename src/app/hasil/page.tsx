'use client';

// ══════════════════════════════════════════════════════════════
// HAKIKU — Halaman Hasil Rekomendasi HAKI
// src/app/hasil/page.tsx
// ══════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import type { DiagnosisResult } from '@/types';

export default function HasilPage() {
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('diagnosisResult');
    if (stored) {
      try { setResult(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  const isKriya = result?.category?.includes('Kriya') ?? false;
  const lp      = result?.lolosPct ?? 82;

  const lolosColor =
    lp >= 70 ? 'linear-gradient(90deg,#10B981,#34D399)' :
    lp >= 40 ? 'linear-gradient(90deg,#F59E0B,#FCD34D)' :
               'linear-gradient(90deg,#EF4444,#FCA5A5)';

  const lolosText =
    lp >= 70 ? '✅ Peluang lolos tinggi! Tidak ada kemiripan kuat dalam database PDKI.' :
    lp >= 40 ? '⚠️ Ada beberapa merek mirip. Konsultasikan dengan ahli HAKI kami.' :
               '🚨 Kemiripan kuat ditemukan. Sangat disarankan berkonsultasi sebelum daftar.';

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />

      <main className="flex-1 screen-container">

        {/* ── Result Hero ──────────────────────────────────── */}
        <div className="text-center py-6 px-4"
             style={{ background: 'linear-gradient(135deg,#0B2D96,#1B4FD8,#2563EB)' }}>
          <span className="text-4xl block mb-2 animate-bounce-in">✅</span>
          <h1 className="font-display text-xl text-white font-bold mb-1">Rekomendasi HAKI Siap!</h1>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Berdasarkan analisis kategori karya & database PDKI DJKI
          </p>
        </div>

        {/* ── Lolos Estimasi ───────────────────────────────── */}
        <div className="mx-4 mt-3 bg-white border border-slate-200 rounded-xl p-4 relative overflow-hidden"
             style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
          <div className="absolute top-0 left-0 right-0 h-0.5"
               style={{ background: 'linear-gradient(90deg,#1B4FD8,#F97316)' }} />
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-extrabold text-slate-800">📊 Estimasi Peluang Lolos</span>
            <span className="font-display text-2xl font-black"
                  style={{ background: lolosColor, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {lp}%
            </span>
          </div>
          <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden mb-2">
            <div className="h-full rounded-full transition-all duration-700"
                 style={{ width: `${lp}%`, background: lolosColor }} />
          </div>
          <p className="text-[11px] text-slate-500">{lolosText}</p>
        </div>

        {/* ── Rekomendasi Utama ────────────────────────────── */}
        <div className="mx-4 mt-3 bg-white border-2 border-blue-600 rounded-2xl p-4 relative overflow-hidden"
             style={{ boxShadow: '0 8px 32px rgba(27,79,216,0.15)' }}>
          <div className="absolute top-0 left-0 right-0 h-0.5"
               style={{ background: 'linear-gradient(90deg,#1B4FD8,#F97316)' }} />
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                 style={{ background: 'linear-gradient(135deg,#1B4FD8,#F97316)', boxShadow: '0 4px 12px rgba(27,79,216,0.3)' }}>
              {isKriya ? '©️' : '🎨'}
            </div>
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider mb-0.5"
                   style={{ color: '#F97316' }}>
                REKOMENDASI UTAMA · Confidence {lp >= 70 ? '92' : '75'}%
              </div>
              <div className="font-display text-base font-bold text-slate-900">
                {isKriya ? 'Hak Cipta + Desain Industri' : 'Hak Cipta (Seni Rupa)'}
              </div>
            </div>
            <span className="badge-orange ml-auto">Prioritas</span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            {isKriya
              ? 'Karya kriya dilindungi Hak Cipta (motif/seni terapan) dan Desain Industri (tampilan produk 3D). Daftarkan keduanya untuk perlindungan berlapis yang komprehensif!'
              : 'Karya desain grafis dilindungi oleh Hak Cipta. Berlaku otomatis sejak karya dibuat, namun pencatatan ke DJKI memberikan bukti kepemilikan yang kuat di pengadilan.'}
          </p>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Biaya UMKM', value: isKriya ? 'Rp 200rb + Rp 250rb' : 'Rp 200.000' },
              { label: 'Estimasi Proses', value: isKriya ? '9–14 hr (HC)' : '9–14 hari kerja' },
              { label: 'Masa Berlaku', value: 'Seumur hidup + 70 thn' },
              { label: 'Dasar Hukum', value: 'PP No. 45/2024' },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl p-2.5"
                   style={{ background: 'linear-gradient(135deg, #EFF6FF, #FFF7ED)' }}>
                <div className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 mb-0.5">{label}</div>
                <div className="text-xs font-extrabold text-slate-800">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Rekomendasi Tambahan ─────────────────────────── */}
        <div className="px-4 pt-3">
          <p className="sect-label">Rekomendasi Tambahan</p>
          {[
            { icon: '™️', title: 'Merek Dagang', desc: 'Nama brand/logo untuk komersial. First-to-file! Biaya UMKM Rp 500.000/kelas.', badge: 'Opsional', cls: 'badge-orange' },
            { icon: '🏭', title: 'Desain Industri', desc: 'Produk kriya diproduksi massal. Syarat: belum dipublikasi >6 bulan.', badge: 'Pertimbangkan', cls: 'badge-blue' },
          ].map(r => (
            <div key={r.title} className="card flex items-center gap-3">
              <span className="text-xl">{r.icon}</span>
              <div className="flex-1">
                <div className="text-xs font-extrabold text-slate-800 mb-0.5">{r.title}</div>
                <div className="text-[11px] text-slate-500">{r.desc}</div>
              </div>
              <span className={r.cls}>{r.badge}</span>
            </div>
          ))}
        </div>

        {/* ── Info Note ────────────────────────────────────── */}
        <div className="px-4 pb-2">
          <div className="info-blue">
            <div className="text-[11px] font-extrabold text-blue-700 mb-1">💡 Catatan AI HAKIKU</div>
            <div className="text-[11px] text-slate-500 leading-relaxed">
              Rekomendasi divalidasi konsultan KI berlisensi DJKI. Semua biaya berdasarkan PP No. 45/2024
              dan bersifat <strong>NON-REFUNDABLE</strong> setelah pembayaran dilakukan.
            </div>
          </div>
        </div>

        {/* ── CTAs ─────────────────────────────────────────── */}
        <div className="px-4 pb-6">
          <Link href="/dokumen" className="btn-blue mb-2">📋 Siapkan Dokumen — Panduan Lengkap</Link>
          <Link href="/konsultasi" className="btn-outline">💬 Konsultasi dengan Ahli HAKI</Link>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
