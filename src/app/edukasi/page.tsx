'use client';

// ══════════════════════════════════════════════════════════════
// HAKIKU — Halaman Edukasi
// src/app/edukasi/page.tsx
// ══════════════════════════════════════════════════════════════

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import { EDU_MODULES, SECTION_LABELS, SECTION_COLORS } from '@/data/modules';
import { HAKI_PRICING, formatRupiah } from '@/data/pricing';
import type { EduFilter, CostChecks, PriceMode } from '@/types';

const FILTERS: { key: EduFilter; label: string }[] = [
  { key: 'semua',        label: 'Semua (14)'  },
  { key: 'fundamental',  label: 'Fundamental' },
  { key: 'persiapan',    label: 'Persiapan'   },
  { key: 'proses',       label: 'Proses'      },
  { key: 'risiko',       label: 'Risiko'      },
  { key: 'bisnis',       label: 'Bisnis'      },
];

const COST_ITEMS: { key: keyof CostChecks; label: string }[] = [
  { key: 'HC', label: 'Hak Cipta (Seni Rupa / Terapan)' },
  { key: 'DI', label: 'Desain Industri (tampilan produk)' },
  { key: 'MK', label: 'Merek Dagang (per kelas)' },
  { key: 'MT', label: 'Materai Rp 10.000' },
];

function getTagClass(tag: string): string {
  if (tag.includes('✅')) return 'badge-green';
  if (tag.includes('%'))  return 'badge-amber';
  return 'badge-gray';
}

export default function EdukasiPage() {
  const [filter,    setFilter]    = useState<EduFilter>('semua');
  const [priceMode, setPriceMode] = useState<PriceMode>('umkm');
  const [checks,    setChecks]    = useState<CostChecks>({ HC: false, DI: false, MK: false, MT: true });

  const completedCount = EDU_MODULES.filter(m => m.done).length;
  const inProgressCount = EDU_MODULES.filter(m => !m.done && m.prog > 0).length;
  const overallPct = Math.round((completedCount / EDU_MODULES.length) * 100);

  // Total biaya
  const totalCost = COST_ITEMS.reduce((sum, { key }) =>
    sum + (checks[key] ? HAKI_PRICING[priceMode][key] : 0), 0);

  // Filter modules
  const filteredModules = filter === 'semua'
    ? EDU_MODULES
    : EDU_MODULES.filter(m => m.sec === filter);

  // Sections to render
  const sections = filter === 'semua'
    ? (['fundamental', 'persiapan', 'proses', 'risiko', 'bisnis'] as const)
    : [filter];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <main className="flex-1 screen-container">

        {/* Hero */}
        <div className="hero-section">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2"
                  style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.9)' }}>
              📚 Pusat Belajar HAKI
            </span>
            <h1 className="font-display text-xl font-bold text-white mb-1">
              14 Modul Edukasi<br/>
              <span style={{ color: '#FED7AA' }}>Mudah & Praktis</span>
            </h1>
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Dari dasar sampai monetisasi — dalam bahasa yang mudah dipahami semua orang.
            </p>
          </div>
        </div>

        {/* ── Kalkulator Biaya ──────────────────────────────── */}
        <div className="mx-4 mt-3 border-2 border-blue-600 rounded-2xl overflow-hidden"
             style={{ boxShadow: '0 8px 32px rgba(27,79,216,0.15)' }}>
          <div className="px-4 py-3" style={{ background: 'linear-gradient(135deg,#0B2D96,#1B4FD8,#F97316)' }}>
            <div className="font-display text-sm font-bold text-white mb-0.5">🧮 Kalkulator Estimasi Biaya</div>
            <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.75)' }}>Berdasarkan PP No. 45 Tahun 2024 · Data DJKI Kemenkumham RI</div>
          </div>
          <div className="p-4 bg-white">
            {/* Toggle UMKM / Umum */}
            <div className="flex gap-2 mb-4">
              {(['umkm', 'umum'] as PriceMode[]).map(m => (
                <button key={m} onClick={() => setPriceMode(m)}
                        className={`flex-1 py-2 rounded-xl text-[11px] font-extrabold transition-all duration-150 border-none cursor-pointer font-sans ${
                          priceMode === m ? 'text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                        style={priceMode === m ? { background: 'linear-gradient(135deg,#1B4FD8,#F97316)' } : {}}>
                  {m === 'umkm' ? 'UMKM / Perorangan' : 'Umum / Non-UMKM'}
                </button>
              ))}
            </div>

            <div className="text-[11px] font-extrabold text-slate-600 mb-2">Pilih jenis HAKI:</div>

            {COST_ITEMS.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-2.5 py-2 border-b border-slate-100 last:border-b-0">
                <input type="checkbox" id={`chk${key}`}
                       checked={checks[key]}
                       onChange={e => setChecks(c => ({ ...c, [key]: e.target.checked }))}
                       className="w-4 h-4 cursor-pointer accent-blue-700" />
                <label htmlFor={`chk${key}`} className="flex-1 text-xs font-semibold text-slate-800 cursor-pointer">
                  {label}
                  <span className="ml-1.5 text-slate-400">— {formatRupiah(HAKI_PRICING[priceMode][key])}</span>
                </label>
              </div>
            ))}

            {/* Selected items breakdown */}
            {COST_ITEMS.some(({ key }) => checks[key]) && (
              <div className="mt-3 space-y-1">
                {COST_ITEMS.filter(({ key }) => checks[key]).map(({ key, label }) => (
                  <div key={key} className="flex justify-between text-xs">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-extrabold text-slate-800">{formatRupiah(HAKI_PRICING[priceMode][key])}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Total */}
            <div className="flex justify-between items-center mt-3 p-3 rounded-xl border border-slate-200"
                 style={{ background: 'linear-gradient(135deg, #EFF6FF, #FFF7ED)' }}>
              <span className="text-xs font-extrabold text-slate-600">Total Estimasi Biaya PNBP</span>
              <span className="font-display text-xl font-black text-gradient">{formatRupiah(totalCost)}</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-2 leading-relaxed">
              ⚠️ Biaya PNBP bersifat <strong>NON-REFUNDABLE</strong> setelah dibayarkan.
              Sumber: PP No. 45 Tahun 2024.
            </div>
          </div>
        </div>

        {/* ── Filter Tabs ───────────────────────────────────── */}
        <div className="flex gap-1.5 px-4 mt-4 overflow-x-auto scroll-x-hidden pb-1">
          {FILTERS.map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-extrabold transition-all duration-150 border-none cursor-pointer font-sans ${
                      filter === key ? 'text-white shadow-md' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                    style={filter === key
                      ? { background: 'linear-gradient(135deg,#1B4FD8,#F97316)', boxShadow: '0 3px 10px rgba(27,79,216,0.3)' }
                      : {}}>
              {label}
            </button>
          ))}
        </div>

        {/* ── Progress Bar ──────────────────────────────────── */}
        <div className="flex items-center gap-2.5 px-4 mt-3 mb-1">
          <span className="text-[11px] font-bold text-slate-500">Progress:</span>
          <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="prog-fill" style={{ width: `${overallPct}%` }} />
          </div>
          <span className="text-[11px] font-extrabold text-gradient whitespace-nowrap">
            {completedCount + inProgressCount} / {EDU_MODULES.length} Modul
          </span>
        </div>

        {/* ── Modules by Section ────────────────────────────── */}
        {sections.map(sec => {
          const mods = filter === 'semua'
            ? EDU_MODULES.filter(m => m.sec === sec)
            : filteredModules;

          if (mods.length === 0) return null;

          return (
            <div key={sec}>
              {filter === 'semua' && (
                <div className="px-4 pt-3 pb-1.5 text-[10px] font-extrabold uppercase tracking-widest"
                     style={{ color: SECTION_COLORS[sec] ?? '#1B4FD8' }}>
                  {SECTION_LABELS[sec]}
                </div>
              )}
              {filter !== 'semua' && (
                <div className="px-4 pt-3 pb-1.5 text-[10px] font-extrabold uppercase tracking-widest"
                     style={{ color: SECTION_COLORS[sec] ?? '#1B4FD8' }}>
                  {SECTION_LABELS[sec]}
                </div>
              )}

              {mods.map(m => (
                <div key={m.id} className="mx-4 mb-2 bg-white border border-slate-200 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:border-blue-400 hover:shadow-brand hover:-translate-y-px"
                     style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}>
                  {/* Module header */}
                  <div className="flex gap-3 items-center p-3">
                    <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-xl"
                         style={{ background: m.bg }}>
                      {m.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-extrabold text-slate-900 leading-tight mb-0.5 pr-2">{m.title}</div>
                      <div className="text-[10px] text-slate-400">{m.sub}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <div className="text-[10px] text-slate-400 font-semibold">⏱ {m.dur}</div>
                      <div className="w-12 h-1 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full"
                             style={{ width: `${m.prog}%`, background: 'linear-gradient(90deg,#1B4FD8,#F97316)' }} />
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="px-3 pb-2.5 pt-0 border-t border-slate-100 flex gap-1.5 flex-wrap">
                    {m.tags.map(tag => (
                      <span key={tag} className={getTagClass(tag)}>{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        })}

        <div className="h-5" />
      </main>
      <BottomNav />
    </div>
  );
}
