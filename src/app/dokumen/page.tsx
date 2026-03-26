'use client';

// ══════════════════════════════════════════════════════════════
// HAKIKU — Halaman Dokumen & Tracker
// src/app/dokumen/page.tsx
// ══════════════════════════════════════════════════════════════

import { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import { formatFileSize } from '@/lib/utils';

interface DocItem { id: number; title: string; hint: string; required: boolean }

const DOCS: DocItem[] = [
  { id: 1, title: 'Identitas Pemohon (KTP + Surat UMKM)', hint: 'Scan KTP berlaku + Surat Pernyataan UMK bermaterai Rp 10.000 untuk tarif UMKM yang hemat 70%', required: true },
  { id: 2, title: 'File Karya (Foto/Scan Min. 300 dpi)',  hint: 'Format JPG/PNG/PDF, bebas watermark. Desain Industri: foto dari 6 sudut pandang', required: true },
  { id: 3, title: 'Surat Pernyataan Kepemilikan Karya',   hint: 'Bermaterai Rp 10.000. Template resmi tersedia — bisa diisi dan diunduh langsung', required: true },
  { id: 4, title: 'Deskripsi Karya & Jenis Ciptaan',      hint: 'Judul karya, tanggal penciptaan, kategori DJKI (Seni Rupa / Seni Terapan / Sinematografi)', required: true },
  { id: 5, title: 'Akun Portal DJKI + Kode Billing',       hint: 'Daftar di e-hakcipta.dgip.go.id → Permohonan Baru → Generate Billing → Bayar sbl 23.59', required: false },
];

const STEPS = [
  { num: 1, title: 'Tentukan jenis HAKI yang akan didaftarkan',   phase: 'prep',   body: 'Identifikasi kebutuhan: <b>Hak Cipta</b> untuk karya seni/desain, <b>Desain Industri</b> untuk tampilan produk fisik, <b>Merek</b> untuk brand/nama dagang. Ketiganya bisa didaftarkan bersamaan untuk perlindungan berlapis.' },
  { num: 2, title: 'Siapkan dokumen identitas pemohon',            phase: 'prep',   body: 'Perorangan: scan KTP/Paspor. UMKM: tambah Surat Pernyataan UMK bermaterai Rp 10.000 untuk <b>tarif lebih hemat 70%</b>.' },
  { num: 3, title: 'Siapkan dokumentasi karya secara lengkap',     phase: 'prep',   body: 'Foto/scan karya resolusi <b>min. 300 dpi</b> (JPG/PNG/PDF). Desain Industri: foto dari <b>6 sudut</b> (depan, belakang, kiri, kanan, atas, bawah). Belum dipublikasi >6 bulan untuk DI.' },
  { num: 4, title: 'Buat akun di portal DJKI yang sesuai',         phase: 'online', body: '<b>Hak Cipta:</b> e-hakcipta.dgip.go.id &nbsp;|&nbsp; <b>Merek:</b> merek.dgip.go.id &nbsp;|&nbsp; <b>DI:</b> dgip.go.id<br/>⚠️ <b>JANGAN gunakan VPN/proxy</b> — sistem DJKI bisa error!' },
  { num: 5, title: 'Login & buat permohonan baru',                 phase: 'online', body: 'Pilih menu <b>Permohonan Baru</b>. Pilih kategori: <b>"UMK/UMKM"</b> untuk tarif lebih murah atau "Umum".' },
  { num: 6, title: 'Isi data karya & unggah dokumen',              phase: 'online', body: 'Masukkan judul, deskripsi, tanggal penciptaan, jenis ciptaan. Pastikan file <b>bebas watermark pihak ketiga</b>.' },
  { num: 7, title: 'Generate kode billing & bayar',                phase: 'online', body: 'Klik <b>Buat Billing</b>. Bayar via virtual account bank.<br/>⚠️ <b>Bayar sebelum 23.59!</b> Biaya <b>NON-REFUNDABLE</b> setelah dibayarkan.' },
  { num: 8, title: 'Verifikasi & submit permohonan',               phase: 'online', body: 'Periksa semua data dan dokumen. Klik <b>Selesai → OK</b>. Unduh tanda terima dari dashboard DJKI.' },
  { num: 9, title: 'Proses pemeriksaan oleh DJKI',                 phase: 'djki',   body: '<b>Hak Cipta:</b> 9–14 hari kerja &nbsp;|&nbsp; <b>Desain Industri:</b> 6–12 bulan &nbsp;|&nbsp; <b>Merek:</b> 8–12 bulan. Pantau di dashboard DJKI.' },
  { num: 10, title: 'Terima & unduh sertifikat digital HAKI',      phase: 'djki',   body: 'DJKI kirim notifikasi via email. Unduh sertifikat dari dashboard akun. <b>Sertifikat digital sah secara hukum!</b> Buat salinan cadangan.' },
];

const PHASE_STYLES: Record<string, string> = {
  prep:   'bg-orange-100 text-orange-700',
  online: 'bg-blue-100 text-blue-700',
  djki:   'bg-emerald-100 text-emerald-700',
};
const PHASE_LABELS: Record<string, string> = { prep: 'Persiapan', online: 'Online', djki: 'DJKI' };

export default function DokumenPage() {
  const [files, setFiles]         = useState<Record<number, File | null>>({});
  const [openSteps, setOpenSteps] = useState<Set<number>>(new Set([1]));
  const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const requiredCount = DOCS.filter(d => d.required).length;
  const uploadedCount = DOCS.filter(d => d.required && files[d.id]).length;
  const pct = Math.round((uploadedCount / requiredCount) * 100);

  function handleFile(id: number, file: File | null) {
    setFiles(f => ({ ...f, [id]: file }));
  }
  function toggleStep(n: number) {
    setOpenSteps(s => { const ns = new Set(s); ns.has(n) ? ns.delete(n) : ns.add(n); return ns; });
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <main className="flex-1 screen-container">

        {/* Hero */}
        <div className="text-center px-4 py-5" style={{ background: 'linear-gradient(135deg,#0B2D96,#1B4FD8,#F97316)' }}>
          <div className="text-xs font-bold mb-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Koleksi Motif Kawung Kontemporer · Hak Cipta
          </div>
          <div className="rounded-xl p-3 inline-block" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
            <div className="font-display text-2xl font-black text-white mb-1">
              {uploadedCount} dari {requiredCount} Dokumen Siap ✅
            </div>
            <div className="text-[11px]" style={{ color: 'rgba(255,255,255,0.75)' }}>
              {pct >= 100 ? 'Semua dokumen siap! Submit ke DJKI sekarang.' : 'Lengkapi dokumen sebelum submit ke portal DJKI'}
            </div>
          </div>
        </div>

        {/* Overall progress */}
        <div className="mx-4 mt-3">
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="prog-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex justify-between mt-1">
            <div className="text-[11px] text-slate-500 font-semibold">Progress dokumen</div>
            <div className="text-[11px] font-extrabold text-gradient">{pct}%</div>
          </div>
        </div>

        {/* Scope note */}
        <div className="info-blue mx-4 mt-2">
          <div className="text-[11px] font-extrabold text-blue-700 mb-0.5">💡 Scope HAKIKU</div>
          <div className="text-[11px] text-slate-500 leading-relaxed">
            HAKIKU membantu kamu <strong>mempersiapkan & mengupload dokumen</strong>. Submit akhir dilakukan langsung di portal resmi DJKI.
          </div>
        </div>

        {/* Success banner */}
        {pct >= 100 && (
          <div className="info-green mx-4">
            <div className="text-[11px] font-extrabold text-emerald-700 mb-0.5">🎉 Semua dokumen siap!</div>
            <div className="text-[11px] text-slate-500">Kamu siap submit ke portal DJKI. Ikuti 10 langkah panduan di bawah.</div>
          </div>
        )}

        {/* Document Checklist */}
        <div className="px-4 pt-3">
          <p className="sect-label">Upload & Checklist Dokumen</p>
        </div>

        {DOCS.map(doc => {
          const f = files[doc.id];
          const done = !!f;
          return (
            <div key={doc.id}
                 className={`mx-4 mb-2 bg-white rounded-xl border p-3 flex gap-3 transition-all duration-200 ${done ? 'border-emerald-400' : doc.id === 4 ? 'border-blue-500' : 'border-slate-200'}`}
                 style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
              {/* Status circle */}
              <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-extrabold mt-0.5 transition-all duration-300 ${
                done ? 'text-white' : doc.id === 4 ? 'text-white' : 'bg-slate-200 text-slate-400'
              }`}
                style={done
                  ? { background: 'linear-gradient(135deg,#10B981,#34D399)', boxShadow: '0 2px 8px rgba(16,185,129,0.3)' }
                  : doc.id === 4
                  ? { background: 'linear-gradient(135deg,#1B4FD8,#F97316)', boxShadow: '0 2px 8px rgba(27,79,216,0.3)' }
                  : {}}>
                {done ? '✓' : doc.id === 4 ? '!' : doc.id}
              </div>

              <div className="flex-1">
                <div className="text-xs font-extrabold text-slate-800 mb-0.5">{doc.title}</div>
                <div className="text-[11px] text-slate-500 leading-relaxed mb-2">{doc.hint}</div>

                {/* Uploaded file chip */}
                {f && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-emerald-400 bg-emerald-50 text-[11px] font-bold text-emerald-700 mb-2">
                    📄 {f.name}
                    <span className="text-slate-400 font-normal">({formatFileSize(f.size)})</span>
                  </div>
                )}

                {/* Hidden file input */}
                <input
                  ref={el => { inputRefs.current[doc.id] = el; }}
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={e => handleFile(doc.id, e.target.files?.[0] ?? null)}
                />

                <div className="flex gap-2 flex-wrap">
                  {!f ? (
                    <button
                      onClick={() => inputRefs.current[doc.id]?.click()}
                      className="px-3 py-1.5 rounded-lg text-white text-[10px] font-extrabold"
                      style={{ background: 'linear-gradient(135deg,#EA580C,#F97316)' }}>
                      📁 Upload Dokumen
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => inputRefs.current[doc.id]?.click()}
                        className="px-3 py-1.5 rounded-lg text-white text-[10px] font-extrabold"
                        style={{ background: 'linear-gradient(135deg,#EA580C,#F97316)' }}>
                        🔄 Ganti File
                      </button>
                      <button
                        onClick={() => handleFile(doc.id, null)}
                        className="px-3 py-1.5 rounded-lg text-slate-500 bg-slate-100 text-[10px] font-extrabold hover:bg-slate-200">
                        ✕ Hapus
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Step accordion */}
        <div className="px-4 pt-3">
          <p className="sect-label">📋 Panduan 10 Langkah Pendaftaran DJKI</p>
        </div>

        {STEPS.map(s => (
          <div key={s.num} className="mx-4 mb-2 bg-white border border-slate-200 rounded-xl overflow-hidden"
               style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
            <div className="flex gap-2.5 px-3 py-3 items-center cursor-pointer select-none hover:bg-slate-50 transition-colors"
                 onClick={() => toggleStep(s.num)}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold text-white flex-shrink-0"
                   style={{ background: 'linear-gradient(135deg,#1B4FD8,#F97316)' }}>
                {s.num}
              </div>
              <div className="flex-1 text-xs font-extrabold text-slate-800">{s.title}</div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${PHASE_STYLES[s.phase]}`}>
                {PHASE_LABELS[s.phase]}
              </span>
            </div>
            {openSteps.has(s.num) && (
              <div className="px-3 pb-3 pt-0 text-[11px] text-slate-500 leading-relaxed border-t border-slate-100"
                   style={{ paddingLeft: '2.75rem' }}
                   dangerouslySetInnerHTML={{ __html: s.body }} />
            )}
          </div>
        ))}

        <div className="h-5" />
      </main>
      <BottomNav />
    </div>
  );
}
