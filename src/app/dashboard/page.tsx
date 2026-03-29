'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';

const HKI_PORTFOLIO = [
  { icon: '™️', bg: '#ECFDF5', type: 'Merek Dagang · Kelas 25',      name: 'BatikSari',                          exp: 'Terdaftar 12 Jan 2024 · s/d Jan 2034',    badge: 'badge-green',  status: 'Aktif'  },
  { icon: '©️', bg: '#EEF3FF', type: 'Hak Cipta · Seni Terapan',     name: 'Koleksi Motif Parang Modern 2024',   exp: 'Terdaftar 3 Mar 2024 · Seumur hidup',     badge: 'badge-green',  status: 'Aktif'  },
  { icon: '📋', bg: '#FFF0E0', type: 'Hak Cipta · Dokumen Disiapkan', name: 'Koleksi Motif Kawung Kontemporer',   exp: 'Mulai 18 Mar 2026 · Selesaikan dokumen →',    badge: 'badge-amber',  status: 'Proses' },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <main className="flex-1 screen-container">

        {/* Header */}
        <div className="px-4 py-5" style={{ background: 'linear-gradient(135deg,#0B2D96,#1B4FD8,#2563EB)' }}>
          <div className="text-[11px] font-bold mb-1" style={{ color: 'rgba(255,255,255,0.65)' }}>Selamat datang kembali 👋</div>
          <div className="font-display text-xl font-black text-white mb-3">Sari — BatikSari Studio</div>
          <div className="grid grid-cols-3 gap-2">
            {[['3','HAKI Aktif'],['1','Dokumen Disiapkan'],['0','Akan Expired']].map(([n,l])=>(
              <div key={l} className="rounded-xl p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.13)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <div className="font-display text-2xl font-black text-white">{n}</div>
                <div className="text-[9px] font-bold mt-0.5 leading-tight" style={{ color: 'rgba(255,255,255,0.65)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Portofolio */}
        <div className="px-4 pt-4">
          <p className="sect-label">Portofolio HAKI Saya</p>
        </div>
        {HKI_PORTFOLIO.map(h => (
          <Link key={h.name} href="/dokumen"
                className="flex items-center gap-3 mx-4 mb-2 bg-white border border-slate-200 rounded-xl p-3 transition-all duration-200 hover:border-blue-400 hover:shadow-brand hover:translate-x-0.5"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-xl" style={{ background: h.bg }}>{h.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-slate-400 font-bold">{h.type}</div>
              <div className="text-xs font-extrabold text-slate-900 truncate">{h.name}</div>
              <div className="text-[10px] text-slate-400">{h.exp}</div>
            </div>
            <span className={h.badge}>{h.status}</span>
          </Link>
        ))}

        {/* Saran AI */}
        <div className="px-4 pt-3">
          <p className="sect-label">Saran AI HAKIKU</p>
          {[
            { icon: '🌍', t: 'Ekspansi ke ASEAN via Madrid Protocol', s: 'Merek aktif — lindungi di Singapura & Malaysia' },
            { icon: '📚', t: 'Lanjutkan Modul Edukasi', s: 'Anda sudah 21% — selesaikan Modul 3 tentang Nilai HAKI' },
          ].map(a => (
            <div key={a.t} className="flex gap-2.5 items-center mx-0 mb-2 px-3 py-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-150">
              <span className="text-lg">{a.icon}</span>
              <div className="flex-1">
                <div className="text-xs font-extrabold text-slate-800">{a.t}</div>
                <div className="text-[10px] text-slate-400">{a.s}</div>
              </div>
              <span className="text-slate-400 text-sm">›</span>
            </div>
          ))}
        </div>

        <div className="px-4 pt-2 pb-6">
          <Link href="/diagnosis" className="btn-blue">+ Tambah HAKI Baru</Link>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
