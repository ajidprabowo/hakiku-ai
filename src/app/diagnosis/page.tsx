'use client';

// ══════════════════════════════════════════════════════════════
// HAKIKU — Halaman Diagnosis + Hasil HAKI (AI-powered)
// src/app/diagnosis/page.tsx
// ══════════════════════════════════════════════════════════════

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import { searchHKIDatabase } from '@/data/hki-database';
import { formatFileSize } from '@/lib/utils';

type Step = 1 | 2 | 3 | 'analyzing' | 'hasil';

interface KriteriaItem {
  no: number;
  nama: string;
  status: 'lolos' | 'tidak_lolos';
  alasan: string;
  detail: string | null;
}

interface AIResult {
  kriteria: KriteriaItem[];
  lolos_count: number;
  rekomendasi_jenis_haki: string;
  catatan_profesional: string;
}

export default function DiagnosisPage() {
  const [step, setStep]           = useState<Step>(1);
  const [category, setCategory]   = useState('');
  const [dbQuery, setDbQuery]     = useState('');
  const [dbResults, setDbResults] = useState<ReturnType<typeof searchHKIDatabase> | null>(null);
  const [purpose, setPurpose]     = useState('');
  const [file, setFile]           = useState<File | null>(null);
  const [aiResult, setAiResult]   = useState<AIResult | null>(null);
  const [aiError, setAiError]     = useState('');

  const mainRef    = useRef<HTMLDivElement>(null);
  const hasilRef   = useRef<HTMLDivElement>(null);
  const fileRef    = useRef<HTMLInputElement>(null);

  const stepNum  = step === 'hasil' || step === 'analyzing' ? 3 : (step as number);
  const progress = step === 'hasil' ? 100 : Math.round((stepNum / 3) * 100);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  useEffect(() => {
    if (step === 'hasil' && hasilRef.current) {
      setTimeout(() => hasilRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
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

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (f && f.size > 10 * 1024 * 1024) {
      alert('Ukuran file melebihi 10 MB. Silakan pilih file yang lebih kecil.');
      return;
    }
    setFile(f);
  }

  async function selectPurpose(p: string) {
    setPurpose(p);
    setTimeout(() => setStep('analyzing'), 320);

    try {
      const formData = new FormData();
      formData.append('namaMerek', dbQuery || 'Tidak disebutkan');
      formData.append('kategori', category);
      formData.append('tujuan', p);
      formData.append('dbMatchCount', String(dbResults?.total ?? 0));
      formData.append('dbHasConflict', String((dbResults?.exactConflicts.length ?? 0) > 0));
      if (file) formData.append('file', file);

      const res  = await fetch('/api/diagnosis', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok || data.error) {
        setAiError(data.error ?? 'Analisis gagal. Silakan coba lagi.');
      } else {
        setAiResult(data.result);
      }
    } catch {
      setAiError('Gagal terhubung ke server. Pastikan Anda terhubung ke internet.');
    }

    setStep('hasil');
  }

  function resetDiagnosis() {
    setStep(1); setCategory(''); setDbQuery(''); setDbResults(null);
    setPurpose(''); setFile(null); setAiResult(null); setAiError('');
  }

  // ── Derived values ──────────────────────────────────────────
  const lolosCount  = aiResult?.lolos_count ?? 0;
  const totalKrit   = 5;
  const lolosPct    = aiResult ? Math.round((lolosCount / totalKrit) * 100) : 0;
  const isKriya     = category.includes('Kriya');

  const lolosColor =
    lolosPct >= 80 ? 'linear-gradient(90deg,#10B981,#34D399)' :
    lolosPct >= 50 ? 'linear-gradient(90deg,#F59E0B,#FCD34D)' :
                     'linear-gradient(90deg,#EF4444,#FCA5A5)';

  const lolosLabel =
    lolosPct >= 80 ? { text: 'Peluang Lolos Tinggi',   icon: '✅', cls: 'text-emerald-700 bg-emerald-50 border-emerald-200' } :
    lolosPct >= 50 ? { text: 'Peluang Lolos Sedang',   icon: '⚠️', cls: 'text-amber-700 bg-amber-50 border-amber-200'     } :
                     { text: 'Peluang Lolos Rendah',   icon: '🚨', cls: 'text-red-700 bg-red-50 border-red-200'           };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />

      <main ref={mainRef} className="flex-1 screen-container">

        {/* ── Progress Bar ─────────────────────────────────── */}
        <div className="px-4 py-2.5 bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5">
            <span>
              {step === 'hasil'     ? '✅ Diagnosis Selesai'    :
               step === 'analyzing' ? '🔍 AI Menganalisis...'   :
               `Langkah ${step} dari 3`}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
            <div className="prog-fill transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            STEP 1 — Pilih Kategori
        ══════════════════════════════════════════════════ */}
        {step === 1 && (
          <div className="animate-fade-up page-enter">
            <div className="px-4 pt-4 pb-2 flex gap-2.5">
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black text-white"
                   style={{ background: 'linear-gradient(135deg,#1B4FD8,#F97316)' }}>AI</div>
              <div className="bubble-bot">
                Halo! Saya <strong>HAKIKU AI</strong> 🤖<br /><br />
                Saya akan menganalisis karya Anda menggunakan <strong>5 kriteria resmi DJKI</strong>
                dan memberikan estimasi peluang lolos pendaftaran HAKI.<br /><br />
                📌 <strong>Kriya & Kerajinan</strong> — batik, tenun, keramik, anyaman, ukiran<br />
                📌 <strong>Desain Grafis & Visual</strong> — logo, ilustrasi, poster, kemasan<br /><br />
                Pilih kategori karya yang ingin Anda lindungi:
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 px-4 mt-1">
              {[
                { icon: '🪡', label: 'Kriya & Kerajinan',     sub: 'Batik, tenun, keramik, ukiran, anyaman' },
                { icon: '🎨', label: 'Desain Grafis & Visual', sub: 'Logo, ilustrasi, poster, desain kemasan' },
              ].map(({ icon, label, sub }) => (
                <button key={label} onClick={() => selectCategory(label)}
                        className={['border-2 rounded-xl p-3 text-center transition-all duration-200 font-sans',
                          category === label ? 'border-blue-600 text-white' : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50'].join(' ')}
                        style={category === label ? { background: 'linear-gradient(135deg,#1B4FD8,#3B82F6)' } : {}}>
                  <span className="text-2xl block mb-1.5">{icon}</span>
                  <span className="text-[11px] font-extrabold block leading-tight">{label}</span>
                  <span className={`text-[10px] block mt-1 ${category === label ? 'text-blue-100' : 'text-slate-400'}`}>{sub}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            STEP 2 — Nama Merek + Unggah Karya
        ══════════════════════════════════════════════════ */}
        {step === 2 && (
          <div className="animate-fade-up page-enter">
            <div className="px-4 pt-4 pb-2 flex gap-2.5">
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black text-white"
                   style={{ background: 'linear-gradient(135deg,#1B4FD8,#F97316)' }}>AI</div>
              <div className="bubble-bot">
                Kategori dipilih: <strong>{category}</strong> 🎉<br /><br />
                Langkah berikutnya:<br />
                1️⃣ Masukkan <strong>nama merek atau karya</strong> untuk dicek di database PDKI DJKI<br />
                2️⃣ Unggah <strong>foto atau file karya</strong> (opsional) agar AI dapat menganalisis secara visual
              </div>
            </div>

            {/* ── Nama Merek + Cek DB ───────────────────── */}
            <div className="px-4 mb-1">
              <label className="text-[11px] font-bold text-slate-600 block mb-1.5">
                Nama Merek / Karya <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 transition-colors duration-200"
                  placeholder="Contoh: BatikSari, Logo Kopi Nusantara..."
                  value={dbQuery}
                  onChange={e => setDbQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
                <button onClick={handleSearch}
                        className="px-3 py-2 rounded-xl text-white text-xs font-bold transition-transform duration-150 active:scale-95 flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg,#1B4FD8,#F97316)' }}>
                  🔍 Cek
                </button>
              </div>
            </div>

            {/* DB Results */}
            {dbResults && (
              <div className="mx-4 mb-3 mt-2 border border-slate-200 rounded-xl overflow-hidden text-[11px] result-enter"
                   style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
                <div className="grid grid-cols-4 px-3 py-2 font-bold text-white"
                     style={{ background: 'linear-gradient(135deg,#1B4FD8,#F97316)' }}>
                  <div>Nama</div><div>Tipe</div><div>Status</div><div>Pemilik</div>
                </div>
                {dbResults.matches.length === 0 ? (
                  <div className="px-3 py-3 text-emerald-700 font-bold bg-emerald-50">
                    ✅ Tidak ada kemiripan di database PDKI
                  </div>
                ) : (
                  dbResults.matches.map((d, i) => (
                    <div key={i} className={['grid grid-cols-4 px-3 py-2 border-t border-slate-100',
                      dbResults.exactConflicts.includes(d) ? 'bg-red-50' : 'hover:bg-blue-50'].join(' ')}>
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

            {/* ── Upload Foto/File Karya ────────────────── */}
            <div className="px-4 mb-4 mt-1">
              <label className="text-[11px] font-bold text-slate-600 block mb-1.5">
                Foto / File Karya
                <span className="ml-1.5 text-[10px] font-semibold text-slate-400">(Opsional — PDF, JPG, PNG · Maks 10 MB)</span>
              </label>
              <input ref={fileRef} type="file" className="hidden"
                     accept=".pdf,.jpg,.jpeg,.png"
                     onChange={handleFileChange} />
              <div onClick={() => fileRef.current?.click()}
                   className={`upload-zone cursor-pointer ${file ? 'filled' : ''}`}>
                {file ? (
                  <>
                    <div className="text-2xl mb-1">✅</div>
                    <div className="text-xs font-bold text-emerald-700">File Berhasil Diunggah</div>
                    <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-lg border border-emerald-400 bg-white text-[11px] font-bold text-emerald-700">
                      📄 {file.name}
                      <span className="text-slate-400 font-normal">({formatFileSize(file.size)})</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">Klik untuk mengganti file</div>
                  </>
                ) : (
                  <>
                    <div className="text-3xl mb-2">🖼️</div>
                    <div className="text-xs font-bold text-blue-700">Klik untuk Mengunggah Karya</div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      Unggah karya untuk analisis visual oleh AI
                    </div>
                  </>
                )}
              </div>
              {file && (
                <button onClick={() => setFile(null)}
                        className="mt-1.5 text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors">
                  ✕ Hapus file
                </button>
              )}
            </div>

            <div className="px-4 pb-2">
              <button onClick={() => setStep(3)}
                      disabled={dbQuery.trim().length < 2}
                      className="btn-blue disabled:opacity-50 disabled:cursor-not-allowed">
                Lanjut ke Langkah 3 →
              </button>
              {dbQuery.trim().length < 2 && (
                <p className="text-[10px] text-slate-400 text-center mt-1.5">
                  Masukkan nama merek terlebih dahulu untuk melanjutkan
                </p>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            STEP 3 — Tujuan Pendaftaran
        ══════════════════════════════════════════════════ */}
        {step === 3 && (
          <div className="animate-fade-up page-enter">
            <div className="px-4 pt-4 pb-2 flex gap-2.5">
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black text-white"
                   style={{ background: 'linear-gradient(135deg,#1B4FD8,#F97316)' }}>AI</div>
              <div className="bubble-bot">
                Nama karya: <strong>"{dbQuery}"</strong> {file ? '📎 + file karya' : ''}<br /><br />
                Satu langkah lagi! Apa <strong>tujuan utama</strong> Anda mendaftarkan HAKI ini?<br />
                <span className="text-[11px] text-slate-400">AI akan menganalisis berdasarkan 5 kriteria resmi DJKI</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 px-4 mt-1">
              {[
                { icon: '🛡️', label: 'Cegah Peniruan',    sub: 'Lindungi dari plagiat & pencurian' },
                { icon: '🌍', label: 'Keperluan Ekspor',   sub: 'Syarat masuk pasar luar negeri'   },
                { icon: '🤝', label: 'Syarat Kemitraan',   sub: 'Mitra bisnis & investor'           },
                { icon: '💰', label: 'Nilai Aset Bisnis',  sub: 'Monetisasi & lisensi karya'        },
              ].map(({ icon, label, sub }) => (
                <button key={label} onClick={() => selectPurpose(label)}
                        className={['border-2 rounded-xl p-3 text-center transition-all duration-200 font-sans',
                          purpose === label ? 'border-blue-600 text-white' : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50'].join(' ')}
                        style={purpose === label ? { background: 'linear-gradient(135deg,#1B4FD8,#3B82F6)' } : {}}>
                  <span className="text-xl block mb-1.5">{icon}</span>
                  <span className="text-[11px] font-extrabold block">{label}</span>
                  <span className={`text-[10px] block mt-1 ${purpose === label ? 'text-blue-100' : 'text-slate-400'}`}>{sub}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            ANALYZING — Loading State
        ══════════════════════════════════════════════════ */}
        {step === 'analyzing' && (
          <div className="flex flex-col items-center justify-center px-6 py-16 page-enter">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5"
                 style={{ background: 'linear-gradient(135deg,#1B4FD8,#F97316)', boxShadow: '0 8px 32px rgba(27,79,216,0.3)' }}>
              🔍
            </div>
            <div className="font-display text-lg font-bold text-slate-800 mb-2 text-center">
              AI Sedang Menganalisis Karya
            </div>
            <p className="text-xs text-slate-500 text-center mb-6 leading-relaxed">
              Memeriksa <strong>5 kriteria resmi DJKI</strong>:<br />
              kemiripan merek, simbol negara, tokoh terkenal,<br />
              varietas tanaman, dan merek internasional
            </p>
            <div className="flex gap-1.5">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
            <div className="mt-6 w-full max-w-xs space-y-2">
              {[
                '🗄️ Mencocokkan dengan database PDKI...',
                '🏛️ Memeriksa simbol negara & lembaga...',
                '⭐ Menganalisis kemiripan tokoh terkenal...',
                '🌿 Memeriksa varietas tanaman dilindungi...',
                '🌐 Mencocokkan merek internasional...',
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            HASIL — AI Analysis Result
        ══════════════════════════════════════════════════ */}
        {step === 'hasil' && (
          <div ref={hasilRef} className="result-enter">

            {/* Error State */}
            {aiError && (
              <div className="mx-4 mt-4 p-4 rounded-xl border border-red-200 bg-red-50">
                <div className="text-sm font-bold text-red-700 mb-1">❌ Analisis Gagal</div>
                <div className="text-xs text-red-600 mb-3">{aiError}</div>
                <button onClick={resetDiagnosis} className="btn-blue">🔄 Coba Lagi</button>
              </div>
            )}

            {/* Success State */}
            {aiResult && (
              <>
                {/* Hero */}
                <div className="text-center py-6 px-4"
                     style={{ background: 'linear-gradient(135deg,#0B2D96,#1B4FD8,#2563EB)' }}>
                  <div className="text-4xl mb-2 animate-bounce-in">
                    {lolosPct >= 80 ? '✅' : lolosPct >= 50 ? '⚠️' : '🚨'}
                  </div>
                  <h1 className="font-display text-xl text-white font-bold mb-1">
                    Hasil Analisis HAKI Selesai
                  </h1>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>
                    Berdasarkan 5 kriteria resmi DJKI · Karya: "{dbQuery}"
                  </p>
                </div>

                {/* Skor Peluang Lolos */}
                <div className="mx-4 mt-3 bg-white border border-slate-200 rounded-xl p-4 relative overflow-hidden"
                     style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
                  <div className="absolute top-0 left-0 right-0 h-0.5"
                       style={{ background: 'linear-gradient(90deg,#1B4FD8,#F97316)' }} />
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <div className="text-xs font-extrabold text-slate-800 mb-0.5">📊 Estimasi Peluang Lolos DJKI</div>
                      <div className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${lolosLabel.cls}`}>
                        {lolosLabel.icon} {lolosLabel.text}
                      </div>
                    </div>
                    <span className="font-display text-3xl font-black"
                          style={{ background: lolosColor, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                      {lolosPct}%
                    </span>
                  </div>
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden mb-2">
                    <div className="h-full rounded-full transition-all duration-1000"
                         style={{ width: `${lolosPct}%`, background: lolosColor }} />
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {lolosCount} dari {totalKrit} kriteria terpenuhi
                  </div>
                </div>

                {/* 5 Kriteria Detail */}
                <div className="px-4 pt-3">
                  <p className="sect-label">Analisis 5 Kriteria Resmi DJKI</p>
                  <div className="space-y-2">
                    {aiResult.kriteria.map((k) => {
                      const lolos = k.status === 'lolos';
                      return (
                        <div key={k.no}
                             className={`rounded-xl border p-3 transition-all duration-200 ${
                               lolos
                                 ? 'border-emerald-200 bg-emerald-50'
                                 : 'border-red-200 bg-red-50'
                             }`}>
                          <div className="flex items-start gap-2.5">
                            {/* Status Icon */}
                            <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black text-white mt-0.5 ${
                              lolos ? '' : ''
                            }`}
                                 style={{ background: lolos
                                   ? 'linear-gradient(135deg,#10B981,#34D399)'
                                   : 'linear-gradient(135deg,#EF4444,#F87171)',
                                   boxShadow: lolos
                                   ? '0 2px 8px rgba(16,185,129,0.3)'
                                   : '0 2px 8px rgba(239,68,68,0.3)' }}>
                              {lolos ? '✓' : '✗'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                                  lolos ? 'bg-emerald-200 text-emerald-800' : 'bg-red-200 text-red-800'
                                }`}>
                                  K{k.no}
                                </span>
                                <span className="text-[11px] font-extrabold text-slate-800 leading-tight">{k.nama}</span>
                              </div>
                              <p className="text-[11px] text-slate-600 leading-relaxed">{k.alasan}</p>
                              {!lolos && k.detail && (
                                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-red-100 border border-red-200">
                                  <span className="text-[9px] font-black text-red-700">KONFLIK:</span>
                                  <span className="text-[10px] font-bold text-red-700">{k.detail}</span>
                                </div>
                              )}
                            </div>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap ${
                              lolos ? 'bg-emerald-200 text-emerald-800' : 'bg-red-200 text-red-800'
                            }`}>
                              {lolos ? 'LOLOS' : 'TIDAK LOLOS'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Rekomendasi Jenis HAKI */}
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
                        REKOMENDASI JENIS HAKI
                      </div>
                      <div className="font-display text-base font-bold text-slate-900">
                        {aiResult.rekomendasi_jenis_haki}
                      </div>
                    </div>
                    <span className="badge-orange ml-auto">Prioritas</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Biaya UMKM',      value: isKriya ? 'Rp 200rb + Rp 250rb' : 'Rp 200.000' },
                      { label: 'Estimasi Proses',  value: '9–14 Hari Kerja' },
                      { label: 'Masa Berlaku',     value: 'Seumur hidup + 70 thn' },
                      { label: 'Dasar Hukum',      value: 'PP No. 45/2024' },
                    ].map(({ label, value }) => (
                      <div key={label} className="rounded-xl p-2.5"
                           style={{ background: 'linear-gradient(135deg,#EFF6FF,#FFF7ED)' }}>
                        <div className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 mb-0.5">{label}</div>
                        <div className="text-xs font-extrabold text-slate-800">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Catatan Profesional AI */}
                <div className="px-4 pt-3">
                  <div className="bg-white border border-slate-200 rounded-xl p-4"
                       style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                           style={{ background: 'linear-gradient(135deg,#1B4FD8,#F97316)' }}>AI</div>
                      <span className="text-[11px] font-extrabold text-slate-800">Catatan Profesional HAKIKU AI</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {aiResult.catatan_profesional}
                    </p>
                    <div className="mt-2 text-[10px] text-slate-400">
                      ⚠️ Semua biaya PNBP bersifat <strong>NON-REFUNDABLE</strong> setelah dibayarkan · PP No. 45/2024
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="px-4 pt-3 pb-6 flex flex-col gap-2">
                  <Link href="/dokumen" className="btn-blue">📋 Siapkan Dokumen — Panduan Lengkap</Link>
                  <Link href="/konsultasi" className="btn-outline">💬 Konsultasi dengan Ahli HAKI</Link>
                  <button onClick={resetDiagnosis}
                          className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-500 border border-slate-200 bg-white hover:bg-slate-50 transition-colors duration-200">
                    🔄 Ulangi Diagnosis
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        <div className="h-4" />
      </main>

      <BottomNav />
    </div>
  );
}
