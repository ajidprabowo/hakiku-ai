'use client';

// ══════════════════════════════════════════════════════════════
// HAKIKU — Halaman Diagnosis HAKI
// src/app/diagnosis/page.tsx
// ══════════════════════════════════════════════════════════════

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import { searchHKIDatabase, calculateLolosPct } from '@/data/hki-database';

type Step = 1 | 2 | 3;

export default function DiagnosisPage() {
  const router = useRouter();
  const [step, setStep]       = useState<Step>(1);
  const [category, setCategory] = useState('');
  const [dbQuery, setDbQuery]   = useState('');
  const [dbResults, setDbResults] = useState<ReturnType<typeof searchHKIDatabase> | null>(null);
  const [purpose, setPurpose]   = useState('');

  const progress = Math.round((step / 3) * 100);

  // ── Step 1: Pilih kategori ──────────────────────────────────
  function selectCategory(cat: string) {
    setCategory(cat);
    setTimeout(() => setStep(2), 380);
  }

  // ── Step 2: Cek database ────────────────────────────────────
  function handleSearch() {
    if (dbQuery.length < 2) return;
    const result = searchHKIDatabase(dbQuery);
    setDbResults(result);
  }

  // ── Step 3: Pilih tujuan & ke hasil ────────────────────────
  function selectPurpose(p: string) {
    setPurpose(p);
    const lp = dbResults
      ? calculateLolosPct(dbResults.total, dbResults.exactConflicts.length > 0)
      : 82;

    // Simpan hasil ke sessionStorage untuk halaman /hasil
    sessionStorage.setItem('diagnosisResult', JSON.stringify({
      category,
      purpose: p,
      lolosPct: lp,
      hasConflict: (dbResults?.exactConflicts.length ?? 0) > 0,
      matchCount: dbResults?.total ?? 0,
      searchQuery: dbQuery,
    }));

    router.push('/hasil');
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />

      <main className="flex-1 screen-container">

        {/* Progress Bar */}
        <div className="px-4 py-2.5 bg-white border-b border-slate-200">
          <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5">
            <span>Langkah {step} dari 3</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
            <div className="prog-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* ── STEP 1: Kategori Karya ───────────────────────── */}
        {step === 1 && (
          <div className="animate-fade-up">
            <div className="px-4 pt-4 pb-2 flex gap-2.5">
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black text-white"
                   style={{ background: 'linear-gradient(135deg,#1B4FD8,#F97316)' }}>AI</div>
              <div className="bubble-bot">
                Halo! Saya <strong>HAKIKU AI</strong> 🤖<br /><br />
                Platform ini melayani <strong>2 kategori karya</strong>:<br />
                📌 <strong>Kriya & Kerajinan</strong> — batik, tenun, keramik, anyaman, ukiran<br />
                📌 <strong>Desain Grafis & Visual</strong> — logo, ilustrasi, poster, kemasan<br /><br />
                Pilih kategori karya yang ingin kamu lindungi:
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 px-4 mt-1">
              {[
                { icon: '🪡', label: 'Kriya & Kerajinan',       sub: 'Batik, tenun, keramik, ukiran, anyaman' },
                { icon: '🎨', label: 'Desain Grafis & Visual',   sub: 'Logo, ilustrasi, poster, desain kemasan' },
              ].map(({ icon, label, sub }) => (
                <button key={label} onClick={() => selectCategory(label)}
                        className={[
                          'border-2 rounded-xl p-3 text-center transition-all duration-200 font-sans',
                          category === label
                            ? 'border-blue-600 text-white'
                            : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50',
                        ].join(' ')}
                        style={category === label
                          ? { background: 'linear-gradient(135deg,#1B4FD8,#3B82F6)' }
                          : {}}>
                  <span className="text-2xl block mb-1.5">{icon}</span>
                  <span className="text-[11px] font-extrabold block leading-tight">{label}</span>
                  <span className={`text-[10px] block mt-1 ${category === label ? 'text-blue-100' : 'text-slate-400'}`}>{sub}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: Cek Database ─────────────────────────── */}
        {step === 2 && (
          <div className="animate-fade-up">
            <div className="px-4 pt-4 pb-2 flex gap-2.5">
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black text-white"
                   style={{ background: 'linear-gradient(135deg,#1B4FD8,#F97316)' }}>AI</div>
              <div className="bubble-bot">
                Bagus! Kamu memilih <strong>{category}</strong> 🎉<br /><br />
                Sekarang cek apakah nama merek atau karya kamu sudah ada di{' '}
                <strong>database PDKI DJKI</strong> (57 data). Ketik nama merek/karya:
              </div>
            </div>

            {/* Search Input */}
            <div className="flex gap-2 px-4 mb-3">
              <input
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500"
                placeholder="Contoh: BatikSari, Logo Kopi Nusantara..."
                value={dbQuery}
                onChange={e => setDbQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
              <button onClick={handleSearch}
                      className="px-3 py-2 rounded-xl text-white text-xs font-bold"
                      style={{ background: 'linear-gradient(135deg,#1B4FD8,#F97316)' }}>
                🔍 Cek
              </button>
            </div>

            {/* DB Results */}
            {dbResults && (
              <div className="mx-4 mb-3 border border-slate-200 rounded-xl overflow-hidden text-[11px]"
                   style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
                <div className="grid grid-cols-4 px-3 py-2 font-bold text-white"
                     style={{ background: 'linear-gradient(135deg,#1B4FD8,#F97316)' }}>
                  <div>Nama</div><div>Tipe</div><div>Status</div><div>Pemilik</div>
                </div>
                {dbResults.matches.length === 0 ? (
                  <div className="px-3 py-3 text-emerald-700 font-bold bg-emerald-50">
                    ✅ Tidak ada kemiripan — peluang lolos tinggi!
                  </div>
                ) : (
                  dbResults.matches.map((d, i) => (
                    <div key={i} className={[
                      'grid grid-cols-4 px-3 py-2 border-t border-slate-100',
                      dbResults.exactConflicts.includes(d) ? 'bg-red-50' : 'hover:bg-blue-50',
                    ].join(' ')}>
                      <div className="font-bold text-slate-800 truncate">{d.nama}</div>
                      <div className="text-slate-500">{d.tipe}</div>
                      <div className="text-slate-500 truncate">{d.status.substring(0, 14)}</div>
                      <div className="text-slate-500 truncate">{d.pemilik.substring(0, 16)}</div>
                    </div>
                  ))
                )}
                <div className="px-3 py-2 bg-blue-50 text-blue-700 font-bold border-t border-slate-100">
                  {dbResults.total} hasil · pdki-indonesia.dgip.go.id
                </div>
              </div>
            )}

            <div className="px-4">
              <button onClick={() => setStep(3)} className="btn-blue">
                Lanjut ke Rekomendasi →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Tujuan ───────────────────────────────── */}
        {step === 3 && (
          <div className="animate-fade-up">
            <div className="px-4 pt-4 pb-2 flex gap-2.5">
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black text-white"
                   style={{ background: 'linear-gradient(135deg,#1B4FD8,#F97316)' }}>AI</div>
              <div className="bubble-bot">
                Apa <strong>tujuan utama</strong> kamu mendaftarkan HAKI ini?
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 px-4 mt-1">
              {[
                { icon: '🛡️', label: 'Cegah peniruan',       sub: 'Lindungi dari plagiat & pencurian' },
                { icon: '🌍', label: 'Keperluan ekspor',      sub: 'Syarat masuk pasar luar negeri' },
                { icon: '🤝', label: 'Syarat partnership',   sub: 'Mitra bisnis & investor' },
                { icon: '💰', label: 'Nilai aset bisnis',    sub: 'Monetisasi & lisensi karya' },
              ].map(({ icon, label, sub }) => (
                <button key={label} onClick={() => selectPurpose(label)}
                        className={[
                          'border-2 rounded-xl p-3 text-center transition-all duration-200 font-sans',
                          purpose === label
                            ? 'border-blue-600 text-white'
                            : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50',
                        ].join(' ')}
                        style={purpose === label
                          ? { background: 'linear-gradient(135deg,#1B4FD8,#3B82F6)' }
                          : {}}>
                  <span className="text-xl block mb-1.5">{icon}</span>
                  <span className="text-[11px] font-extrabold block">{label}</span>
                  <span className={`text-[10px] block mt-1 ${purpose === label ? 'text-blue-100' : 'text-slate-400'}`}>{sub}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="h-4" />
      </main>

      <BottomNav />
    </div>
  );
}
