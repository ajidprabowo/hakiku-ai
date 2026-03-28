'use client';

// ══════════════════════════════════════════════════════════════
// HAKIKU — Halaman Diagnosis + Hasil HAKI (merged)
// src/app/diagnosis/page.tsx
// ══════════════════════════════════════════════════════════════

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import { searchHKIDatabase, calculateLolosPct } from '@/data/hki-database';

type Step = 1 | 2 | 3 | 'hasil';

interface DiagnosisResult {
  category: string;
  purpose: string;
  lolosPct: number;
  hasConflict: boolean;
  matchCount: number;
  searchQuery: string;
}

export default function DiagnosisPage() {
  const [step, setStep]           = useState<Step>(1);
  const [category, setCategory]   = useState('');
  const [dbQuery, setDbQuery]     = useState('');
  const [dbResults, setDbResults] = useState<ReturnType<typeof searchHKIDatabase> | null>(null);
  const [purpose, setPurpose]     = useState('');
  const [result, setResult]       = useState<DiagnosisResult | null>(null);

  const mainRef  = useRef<HTMLDivElement>(null);
  const hasilRef = useRef<HTMLDivElement>(null);

  const stepNum  = step === 'hasil' ? 3 : (step as number);
  const progress = Math.round((stepNum / 3) * 100);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  useEffect(() => {
    if (step === 'hasil' && hasilRef.current) {
      setTimeout(() => {
        hasilRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [step]);

  function selectCategory(cat: string) {
    setCategory(cat);
    setTimeout(() => setStep(2), 320);
  }

  function handleSearch() {
    if (dbQuery.length < 2) return;
    setDbResults(searchHKIDatabase(dbQuery));
  }

  function selectPurpose(p: string) {
    setPurpose(p);
    const lp = dbResults
      ? calculateLolosPct(dbResults.total, dbResults.exactConflicts.length > 0)
      : 82;
    setResult({ category, purpose: p, lolosPct: lp, hasConflict: (dbResults?.exactConflicts.length ?? 0) > 0, matchCount: dbResults?.total ?? 0, searchQuery: dbQuery });
    setTimeout(() => setStep('hasil'), 320);
  }

  function resetDiagnosis() {
    setStep(1); setCategory(''); setDbQuery(''); setDbResults(null); setPurpose(''); setResult(null);
  }

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

      <main ref={mainRef} className="flex-1 screen-container">

        {/* Progress Bar */}
        <div className="px-4 py-2.5 bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5">
            <span>{step === 'hasil' ? '✅ Diagnosis Selesai' : `Langkah ${step} dari 3`}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
            <div className="prog-fill transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* ── STEP 1 ───────────────────────────────────────── */}
        {step === 1 && (
          <div className="animate-fade-up page-enter">
            <div className="px-4 pt-4 pb-2 flex gap-2.5">
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black text-white" style={{ background: 'linear-gradient(135deg,#1B4FD8,#F97316)' }}>AI</div>
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
                { icon: '🪡', label: 'Kriya & Kerajinan',     sub: 'Batik, tenun, keramik, ukiran, anyaman' },
                { icon: '🎨', label: 'Desain Grafis & Visual', sub: 'Logo, ilustrasi, poster, desain kemasan' },
              ].map(({ icon, label, sub }) => (
                <button key={label} onClick={() => selectCategory(label)}
                        className={['border-2 rounded-xl p-3 text-center transition-all duration-200 font-sans', category === label ? 'border-blue-600 text-white' : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50'].join(' ')}
                        style={category === label ? { background: 'linear-gradient(135deg,#1B4FD8,#3B82F6)' } : {}}>
                  <span className="text-2xl block mb-1.5">{icon}</span>
                  <span className="text-[11px] font-extrabold block leading-tight">{label}</span>
                  <span className={`text-[10px] block mt-1 ${category === label ? 'text-blue-100' : 'text-slate-400'}`}>{sub}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2 ───────────────────────────────────────── */}
        {step === 2 && (
          <div className="animate-fade-up page-enter">
            <div className="px-4 pt-4 pb-2 flex gap-2.5">
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black text-white" style={{ background: 'linear-gradient(135deg,#1B4FD8,#F97316)' }}>AI</div>
              <div className="bubble-bot">
                Bagus! Kamu memilih <strong>{category}</strong> 🎉<br /><br />
                Sekarang cek apakah nama merek atau karya kamu sudah ada di{' '}
                <strong>database PDKI DJKI</strong> (57 data). Ketik nama merek/karya:
              </div>
            </div>
            <div className="flex gap-2 px-4 mb-3">
              <input
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 transition-colors duration-200"
                placeholder="Contoh: BatikSari, Logo Kopi Nusantara..."
                value={dbQuery}
                onChange={e => setDbQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
              <button onClick={handleSearch} className="px-3 py-2 rounded-xl text-white text-xs font-bold transition-transform duration-150 active:scale-95" style={{ background: 'linear-gradient(135deg,#1B4FD8,#F97316)' }}>
                🔍 Cek
              </button>
            </div>
            {dbResults && (
              <div className="mx-4 mb-3 border border-slate-200 rounded-xl overflow-hidden text-[11px] result-enter" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
                <div className="grid grid-cols-4 px-3 py-2 font-bold text-white" style={{ background: 'linear-gradient(135deg,#1B4FD8,#F97316)' }}>
                  <div>Nama</div><div>Tipe</div><div>Status</div><div>Pemilik</div>
                </div>
                {dbResults.matches.length === 0 ? (
                  <div className="px-3 py-3 text-emerald-700 font-bold bg-emerald-50">✅ Tidak ada kemiripan — peluang lolos tinggi!</div>
                ) : (
                  dbResults.matches.map((d, i) => (
                    <div key={i} className={['grid grid-cols-4 px-3 py-2 border-t border-slate-100 transition-colors duration-150', dbResults.exactConflicts.includes(d) ? 'bg-red-50' : 'hover:bg-blue-50'].join(' ')}>
                      <div className="font-bold text-slate-800 truncate">{d.nama}</div>
                      <div className="text-slate-500">{d.tipe}</div>
                      <div className="text-slate-500 truncate">{d.status.substring(0, 14)}</div>
                      <div className="text-slate-500 truncate">{d.pemilik.substring(0, 16)}</div>
                    </div>
                  ))
                )}
                <div className="px-3 py-2 bg-blue-50 text-blue-700 font-bold border-t border-slate-100">{dbResults.total} hasil · pdki-indonesia.dgip.go.id</div>
              </div>
            )}
            <div className="px-4">
              <button onClick={() => setStep(3)} className="btn-blue">Lanjut ke Rekomendasi →</button>
            </div>
          </div>
        )}

        {/* ── STEP 3 ───────────────────────────────────────── */}
        {step === 3 && (
          <div className="animate-fade-up page-enter">
            <div className="px-4 pt-4 pb-2 flex gap-2.5">
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black text-white" style={{ background: 'linear-gradient(135deg,#1B4FD8,#F97316)' }}>AI</div>
              <div className="bubble-bot">Apa <strong>tujuan utama</strong> kamu mendaftarkan HAKI ini?</div>
            </div>
            <div className="grid grid-cols-2 gap-2 px-4 mt-1">
              {[
                { icon: '🛡️', label: 'Cegah peniruan',    sub: 'Lindungi dari plagiat & pencurian' },
                { icon: '🌍', label: 'Keperluan ekspor',   sub: 'Syarat masuk pasar luar negeri' },
                { icon: '🤝', label: 'Syarat partnership', sub: 'Mitra bisnis & investor' },
                { icon: '💰', label: 'Nilai aset bisnis',  sub: 'Monetisasi & lisensi karya' },
              ].map(({ icon, label, sub }) => (
                <button key={label} onClick={() => selectPurpose(label)}
                        className={['border-2 rounded-xl p-3 text-center transition-all duration-200 font-sans', purpose === label ? 'border-blue-600 text-white' : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50'].join(' ')}
                        style={purpose === label ? { background: 'linear-gradient(135deg,#1B4FD8,#3B82F6)' } : {}}>
                  <span className="text-xl block mb-1.5">{icon}</span>
                  <span className="text-[11px] font-extrabold block">{label}</span>
                  <span className={`text-[10px] block mt-1 ${purpose === label ? 'text-blue-100' : 'text-slate-400'}`}>{sub}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── HASIL ────────────────────────────────────────── */}
        {step === 'hasil' && result && (
          <div ref={hasilRef} className="result-enter">
            <div className="text-center py-6 px-4" style={{ background: 'linear-gradient(135deg,#0B2D96,#1B4FD8,#2563EB)' }}>
              <span className="text-4xl block mb-2 animate-bounce-in">✅</span>
              <h1 className="font-display text-xl text-white font-bold mb-1">Rekomendasi HAKI Siap!</h1>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>Berdasarkan analisis kategori karya & database PDKI DJKI</p>
            </div>

            <div className="mx-4 mt-3 bg-white border border-slate-200 rounded-xl p-4 relative overflow-hidden" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg,#1B4FD8,#F97316)' }} />
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-extrabold text-slate-800">📊 Estimasi Peluang Lolos</span>
                <span className="font-display text-2xl font-black" style={{ background: lolosColor, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{lp}%</span>
              </div>
              <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden mb-2">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${lp}%`, background: lolosColor }} />
              </div>
              <p className="text-[11px] text-slate-500">{lolosText}</p>
            </div>

            <div className="mx-4 mt-3 bg-white border-2 border-blue-600 rounded-2xl p-4 relative overflow-hidden" style={{ boxShadow: '0 8px 32px rgba(27,79,216,0.15)' }}>
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg,#1B4FD8,#F97316)' }} />
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'linear-gradient(135deg,#1B4FD8,#F97316)', boxShadow: '0 4px 12px rgba(27,79,216,0.3)' }}>{isKriya ? '©️' : '🎨'}</div>
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider mb-0.5" style={{ color: '#F97316' }}>REKOMENDASI UTAMA · Confidence {lp >= 70 ? '92' : '75'}%</div>
                  <div className="font-display text-base font-bold text-slate-900">{isKriya ? 'Hak Cipta + Desain Industri' : 'Hak Cipta (Seni Rupa)'}</div>
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
                  { label: 'Biaya UMKM',     value: isKriya ? 'Rp 200rb + Rp 250rb' : 'Rp 200.000' },
                  { label: 'Est. Proses',    value: isKriya ? '9–14 hr (HC)' : '9–14 hari kerja' },
                  { label: 'Masa Berlaku',   value: 'Seumur hidup + 70 thn' },
                  { label: 'Dasar Hukum',    value: 'PP No. 45/2024' },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl p-2.5" style={{ background: 'linear-gradient(135deg, #EFF6FF, #FFF7ED)' }}>
                    <div className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 mb-0.5">{label}</div>
                    <div className="text-xs font-extrabold text-slate-800">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-4 pt-3">
              <p className="sect-label">Rekomendasi Tambahan</p>
              {[
                { icon: '™️', title: 'Merek Dagang',    desc: 'Nama brand/logo untuk komersial. First-to-file! Biaya UMKM Rp 500.000/kelas.', badge: 'Opsional',      cls: 'badge-orange' },
                { icon: '🏭', title: 'Desain Industri', desc: 'Produk kriya diproduksi massal. Syarat: belum dipublikasi >6 bulan.',            badge: 'Pertimbangkan', cls: 'badge-blue'   },
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

            <div className="px-4 pb-2">
              <div className="info-blue">
                <div className="text-[11px] font-extrabold text-blue-700 mb-1">💡 Catatan AI HAKIKU</div>
                <div className="text-[11px] text-slate-500 leading-relaxed">
                  Rekomendasi divalidasi konsultan KI berlisensi DJKI. Semua biaya berdasarkan PP No. 45/2024 dan bersifat <strong>NON-REFUNDABLE</strong> setelah pembayaran dilakukan.
                </div>
              </div>
            </div>

            <div className="px-4 pb-6 flex flex-col gap-2">
              <Link href="/dokumen" className="btn-blue">📋 Siapkan Dokumen — Panduan Lengkap</Link>
              <Link href="/konsultasi" className="btn-outline">💬 Konsultasi dengan Ahli HAKI</Link>
              <button onClick={resetDiagnosis} className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-500 border border-slate-200 bg-white hover:bg-slate-50 transition-colors duration-200">
                🔄 Ulangi Diagnosis
              </button>
            </div>
          </div>
        )}

        <div className="h-4" />
      </main>

      <BottomNav />
    </div>
  );
}
