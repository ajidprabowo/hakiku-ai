'use client';

// ══════════════════════════════════════════════════════════════
// HAKIKU — Halaman Dokumen: Generate Surat + Panduan DJKI
// src/app/dokumen/page.tsx
// ══════════════════════════════════════════════════════════════

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';

// ── PDF generation (client-side via jsPDF CDN) ───────────────
declare const window: Window & { jspdf?: { jsPDF: new (opts: object) => JsPDFInstance } };

interface JsPDFInstance {
  setFont: (name: string, style: string) => void;
  setFontSize: (size: number) => void;
  setLineWidth: (w: number) => void;
  text: (text: string | string[], x: number, y: number, opts?: object) => void;
  line: (x1: number, y1: number, x2: number, y2: number) => void;
  rect: (x: number, y: number, w: number, h: number, style?: string) => void;
  splitTextToSize: (text: string, maxWidth: number) => string[];
  save: (name: string) => void;
  internal: { pageSize: { getWidth: () => number; getHeight: () => number } };
  getNumberOfPages: () => number;
}

// ── Data surat ───────────────────────────────────────────────
interface SuratData {
  pihakYangMenyatakan: string;
  kewarganegaraan: string;
  namaBadanHukum: string;
  alamat: string;
  namaDesain: string;
  tanggal: string;
  isPerorang: boolean;
  namaPenandatangan: string;
  pernyataan1: string;
  pernyataan2: string;
}

// ── Panduan 10 Langkah ───────────────────────────────────────
const STEPS = [
  { num: 1,  title: 'Tentukan jenis HAKI yang akan didaftarkan',  phase: 'prep',   body: 'Identifikasi kebutuhan: <b>Hak Cipta</b> untuk karya seni/desain, <b>Desain Industri</b> untuk tampilan produk fisik, <b>Merek</b> untuk brand/nama dagang. Ketiganya bisa didaftarkan bersamaan untuk perlindungan berlapis.' },
  { num: 2,  title: 'Siapkan dokumen identitas pemohon',           phase: 'prep',   body: 'Perorangan: scan KTP/Paspor. UMKM: tambah Surat Pernyataan UMK bermaterai Rp 10.000 untuk <b>tarif lebih hemat 70%</b>.' },
  { num: 3,  title: 'Siapkan dokumentasi karya secara lengkap',    phase: 'prep',   body: 'Foto/scan karya resolusi <b>min. 300 dpi</b> (JPG/PNG/PDF). Desain Industri: foto dari <b>6 sudut</b> (depan, belakang, kiri, kanan, atas, bawah). Belum dipublikasi lebih dari 6 bulan untuk Desain Industri.' },
  { num: 4,  title: 'Buat akun di portal DJKI yang sesuai',        phase: 'online', body: '<b>Hak Cipta:</b> e-hakcipta.dgip.go.id &nbsp;|&nbsp; <b>Merek:</b> merek.dgip.go.id &nbsp;|&nbsp; <b>Desain Industri:</b> dgip.go.id<br/>⚠️ <b>JANGAN gunakan VPN/proxy</b> — sistem DJKI bisa error!' },
  { num: 5,  title: 'Login & buat permohonan baru',                phase: 'online', body: 'Pilih menu <b>Permohonan Baru</b>. Pilih kategori: <b>"UMK/UMKM"</b> untuk tarif lebih murah atau "Umum".' },
  { num: 6,  title: 'Isi data karya & unggah dokumen',             phase: 'online', body: 'Masukkan judul, deskripsi, tanggal penciptaan, jenis ciptaan. Pastikan file <b>bebas watermark pihak ketiga</b>.' },
  { num: 7,  title: 'Generate kode billing & bayar',               phase: 'online', body: 'Klik <b>Buat Billing</b>. Bayar via virtual account bank.<br/>⚠️ <b>Bayar sebelum 23.59!</b> Biaya <b>NON-REFUNDABLE</b> setelah dibayarkan.' },
  { num: 8,  title: 'Verifikasi & ajukan permohonan',              phase: 'online', body: 'Periksa semua data dan dokumen. Klik <b>Selesai → OK</b>. Unduh tanda terima dari dashboard DJKI.' },
  { num: 9,  title: 'Proses pemeriksaan oleh DJKI',                phase: 'djki',   body: '<b>Hak Cipta:</b> 9–14 hari kerja &nbsp;|&nbsp; <b>Desain Industri:</b> 6–12 bulan &nbsp;|&nbsp; <b>Merek:</b> 8–12 bulan. Pantau di dashboard DJKI.' },
  { num: 10, title: 'Terima & unduh sertifikat digital HAKI',      phase: 'djki',   body: 'DJKI kirim notifikasi via email. Unduh sertifikat dari dashboard akun. <b>Sertifikat digital sah secara hukum!</b> Buat salinan cadangan.' },
];

const PHASE_STYLES: Record<string, string> = {
  prep:   'bg-orange-100 text-orange-700',
  online: 'bg-blue-100 text-blue-700',
  djki:   'bg-emerald-100 text-emerald-700',
};
const PHASE_LABELS: Record<string, string> = { prep: 'Persiapan', online: 'Online', djki: 'DJKI' };

// ── PDF Generator ────────────────────────────────────────────
function generatePDF(surat: SuratData) {
  const jsPDFLib = window.jspdf;
  if (!jsPDFLib) { alert('Library PDF belum siap. Coba lagi dalam beberapa detik.'); return; }

  const doc = new jsPDFLib.jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W   = doc.internal.pageSize.getWidth();
  const margin = 25;
  const contentW = W - margin * 2;
  let y = 20;

  // ── Header Judul ────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('SURAT PERNYATAAN', W / 2, y, { align: 'center' });
  y += 6;
  doc.text('KEPEMILIKAN DESAIN INDUSTRI', W / 2, y, { align: 'center' });
  y += 10;

  // Garis bawah judul
  doc.setLineWidth(0.5);
  doc.line(margin, y, W - margin, y);
  y += 8;

  // ── Pembuka ─────────────────────────────────────────────────
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text('Yang bertanda tangan di bawah ini:', margin, y);
  y += 8;

  // ── Tabel Data Pemohon ──────────────────────────────────────
  const rows: [string, string][] = [
    ['Nama Pemohon', surat.pihakYangMenyatakan],
  ];
  if (surat.isPerorang && surat.kewarganegaraan) {
    rows.push(['Kewarganegaraan', surat.kewarganegaraan]);
  }
  if (!surat.isPerorang && surat.namaBadanHukum) {
    rows.push(['Nama Badan Hukum', surat.namaBadanHukum]);
  }
  rows.push(['Alamat', surat.alamat]);

  const col1W = 55;
  const col2W = contentW - col1W - 5;

  rows.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text(label, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(':', margin + col1W, y);
    const lines = doc.splitTextToSize(value, col2W);
    doc.text(lines, margin + col1W + 5, y);
    y += lines.length * 5.5 + 2;
  });

  y += 4;

  // ── Pernyataan ──────────────────────────────────────────────
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text('Dengan ini menyatakan bahwa:', margin, y);
  y += 7;

  const pernyataans = [surat.pernyataan1, surat.pernyataan2];
  pernyataans.forEach((p, i) => {
    const lines = doc.splitTextToSize(`${i + 1}.  ${p}`, contentW - 6);
    doc.text(lines, margin, y);
    y += lines.length * 5.5 + 4;
  });

  y += 4;

  // ── Penutup ─────────────────────────────────────────────────
  const penutup = 'Demikian surat pernyataan ini dibuat dengan sebenarnya dan untuk dipergunakan sebagaimana mestinya.';
  const penutupLines = doc.splitTextToSize(penutup, contentW);
  doc.text(penutupLines, margin, y);
  y += penutupLines.length * 5.5 + 10;

  // ── Tanggal & TTD ───────────────────────────────────────────
  doc.text(surat.tanggal, W - margin, y, { align: 'right' });
  y += 6;

  if (!surat.isPerorang && surat.namaBadanHukum) {
    doc.setFont('helvetica', 'bold');
    doc.text(surat.namaBadanHukum, W - margin, y, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    y += 5;
  }

  // Kotak materai
  const matX = W - margin - 28;
  const matY = y;
  doc.setLineWidth(0.3);
  doc.rect(matX, matY, 28, 18);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'italic');
  doc.text('Materai & Tanda Tangan', matX + 14, matY + 9, { align: 'center' });
  y += 25;

  // Nama penandatangan
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(surat.namaPenandatangan, W - margin, y, { align: 'right' });
  y += 5;
  doc.setLineWidth(0.3);
  doc.line(W - margin - 60, y, W - margin, y);

  // ── Footer ──────────────────────────────────────────────────
  const pageH = doc.internal.pageSize.getHeight();
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.text('Dokumen ini dibuat oleh HAKIKU — Platform Konsultasi HAKI Indonesia · hakiku.id', W / 2, pageH - 10, { align: 'center' });
  doc.setLineWidth(0.2);
  doc.line(margin, pageH - 13, W - margin, pageH - 13);

  doc.save(`Surat_Pernyataan_Kepemilikan_Desain_Industri_${surat.namaDesain.replace(/\s+/g, '_')}.pdf`);
}

// ══════════════════════════════════════════════════════════════
// Komponen Utama
// ══════════════════════════════════════════════════════════════
export default function DokumenPage() {
  const [openSteps, setOpenSteps] = useState<Set<number>>(new Set([1]));

  // Form state
  const [jenisPemohon, setJenisPemohon] = useState<'perorangan' | 'badan_hukum'>('perorangan');
  const [namaPemohon, setNamaPemohon]       = useState('');
  const [kewarganegaraan, setKewarganegaraan] = useState('Indonesia');
  const [namaBadanHukum, setNamaBadanHukum]   = useState('');
  const [alamat, setAlamat]                   = useState('');
  const [tanggal, setTanggal]                 = useState('');
  const [namaDesain, setNamaDesain]           = useState('');

  // Process state
  const [generating, setGenerating]   = useState(false);
  const [suratData, setSuratData]     = useState<SuratData | null>(null);
  const [error, setError]             = useState('');
  const [pdfReady, setPdfReady]       = useState(false);

  function toggleStep(n: number) {
    setOpenSteps(s => { const ns = new Set(s); ns.has(n) ? ns.delete(n) : ns.add(n); return ns; });
  }

  // Load jsPDF dari CDN
  function ensureJsPDF(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.jspdf) { resolve(); return; }
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Gagal memuat library PDF'));
      document.head.appendChild(script);
    });
  }

  async function handleGenerate() {
    if (!namaPemohon.trim() || !alamat.trim() || !tanggal.trim() || !namaDesain.trim()) {
      setError('Nama pemohon, alamat, tanggal, dan nama desain industri wajib diisi.');
      return;
    }
    if (jenisPemohon === 'badan_hukum' && !namaBadanHukum.trim()) {
      setError('Nama badan hukum wajib diisi untuk permohonan atas nama badan hukum.');
      return;
    }
    setError('');
    setGenerating(true);
    setSuratData(null);
    setPdfReady(false);

    try {
      const res = await fetch('/api/generate-surat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ namaPemohon, kewarganegaraan, namaBadanHukum, alamat, tanggal, namaDesain, jenisPemohon }),
      });
      const json = await res.json();
      if (!res.ok || json.error) { setError(json.error ?? 'Gagal generate surat.'); return; }

      setSuratData(json.data);
      await ensureJsPDF();
      setPdfReady(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setGenerating(false);
    }
  }

  function handleDownload() {
    if (!suratData) return;
    generatePDF(suratData);
  }

  function handleReset() {
    setSuratData(null); setError(''); setPdfReady(false);
    setNamaPemohon(''); setKewarganegaraan('Indonesia'); setNamaBadanHukum('');
    setAlamat(''); setTanggal(''); setNamaDesain('');
  }

  const isFormValid = namaPemohon.trim() && alamat.trim() && tanggal.trim() && namaDesain.trim() &&
    (jenisPemohon === 'perorangan' || namaBadanHukum.trim());

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <main className="flex-1 screen-container">

        {/* ── Hero ─────────────────────────────────────────── */}
        <div className="px-4 py-5" style={{ background: 'linear-gradient(135deg,#0B2D96,#1B4FD8,#F97316)' }}>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2"
                style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.9)' }}>
            📋 Pusat Dokumen HAKI
          </span>
          <h1 className="font-display text-xl font-bold text-white mb-1">Generate & Panduan Dokumen</h1>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Generate surat pernyataan resmi DJKI secara otomatis, lalu ikuti 10 langkah pendaftaran.
          </p>
        </div>

        {/* ══════════════════════════════════════════════════
            FITUR GENERATE SURAT
        ══════════════════════════════════════════════════ */}
        <div className="px-4 pt-4">
          <p className="sect-label">Generate Dokumen Otomatis</p>
        </div>

        {/* Card Generate */}
        <div className="mx-4 mb-3 bg-white border-2 border-blue-600 rounded-2xl overflow-hidden"
             style={{ boxShadow: '0 8px 32px rgba(27,79,216,0.15)' }}>

          {/* Card Header */}
          <div className="px-4 py-3" style={{ background: 'linear-gradient(135deg,#0B2D96,#1B4FD8,#F97316)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white bg-opacity-20 flex items-center justify-center text-xl flex-shrink-0">📄</div>
              <div>
                <div className="font-display text-sm font-bold text-white">Surat Pernyataan Kepemilikan</div>
                <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  Desain Industri · Format Resmi DJKI · Output PDF
                </div>
              </div>
              <span className="ml-auto text-[9px] font-black px-2 py-1 rounded-full bg-white bg-opacity-20 text-white">AI-POWERED</span>
            </div>
          </div>

          <div className="p-4 space-y-3">

            {/* Jenis Pemohon Toggle */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1.5">Jenis Pemohon</label>
              <div className="grid grid-cols-2 gap-2">
                {(['perorangan', 'badan_hukum'] as const).map(j => (
                  <button key={j} onClick={() => setJenisPemohon(j)}
                          className={['py-2 rounded-xl text-[11px] font-extrabold transition-all duration-150 border-none cursor-pointer font-sans',
                            jenisPemohon === j ? 'text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'].join(' ')}
                          style={jenisPemohon === j ? { background: 'linear-gradient(135deg,#1B4FD8,#F97316)' } : {}}>
                    {j === 'perorangan' ? '👤 Perorangan' : '🏢 Badan Hukum'}
                  </button>
                ))}
              </div>
            </div>

            {/* Nama Pemohon */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Nama Pemohon <span className="text-red-500">*</span>
                <span className="ml-1 text-slate-400 font-normal">(sesuai KTP/Akta)</span>
              </label>
              <input className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 transition-colors"
                     placeholder="Contoh: Sari Dewi Kusuma"
                     value={namaPemohon} onChange={e => setNamaPemohon(e.target.value)} />
            </div>

            {/* Kewarganegaraan — hanya perorangan */}
            {jenisPemohon === 'perorangan' && (
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Kewarganegaraan
                  <span className="ml-1 text-slate-400 font-normal">(untuk perorangan)</span>
                </label>
                <input className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 transition-colors"
                       placeholder="Indonesia"
                       value={kewarganegaraan} onChange={e => setKewarganegaraan(e.target.value)} />
              </div>
            )}

            {/* Nama Badan Hukum — hanya badan hukum */}
            {jenisPemohon === 'badan_hukum' && (
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Nama Badan Hukum <span className="text-red-500">*</span>
                  <span className="ml-1 text-slate-400 font-normal">(sesuai Akta Pendirian)</span>
                </label>
                <input className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 transition-colors"
                       placeholder="Contoh: PT Karya Nusantara"
                       value={namaBadanHukum} onChange={e => setNamaBadanHukum(e.target.value)} />
              </div>
            )}

            {/* Alamat */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Alamat Lengkap <span className="text-red-500">*</span>
              </label>
              <textarea className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 transition-colors resize-none"
                        rows={3}
                        placeholder="Jl. Merdeka No. 10, RT 02/RW 03, Kelurahan Pasar Baru, Kecamatan Sawah Besar, Jakarta Pusat 10710, DKI Jakarta"
                        value={alamat} onChange={e => setAlamat(e.target.value)} />
            </div>

            {/* Nama Desain */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Nama Desain Industri <span className="text-red-500">*</span>
              </label>
              <input className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 transition-colors"
                     placeholder="Contoh: Desain Kemasan Produk Batik Kawung"
                     value={namaDesain} onChange={e => setNamaDesain(e.target.value)} />
            </div>

            {/* Tanggal */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Tanggal Penulisan Surat <span className="text-red-500">*</span>
              </label>
              <input type="date"
                     className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 transition-colors"
                     value={tanggal} onChange={e => setTanggal(e.target.value)} />
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-xl border border-red-200 bg-red-50">
                <p className="text-[11px] font-bold text-red-700">❌ {error}</p>
              </div>
            )}

            {/* Tombol Generate */}
            {!suratData ? (
              <button onClick={handleGenerate}
                      disabled={generating || !isFormValid}
                      className="btn-blue disabled:opacity-50 disabled:cursor-not-allowed">
                {generating ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-flex gap-1">
                      <span className="typing-dot w-1.5 h-1.5" />
                      <span className="typing-dot w-1.5 h-1.5" />
                      <span className="typing-dot w-1.5 h-1.5" />
                    </span>
                    AI Sedang Menyusun Surat...
                  </span>
                ) : '✨ Generate Surat Pernyataan'}
              </button>
            ) : (
              <div className="space-y-2">
                {/* Preview ringkas */}
                <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50">
                  <div className="text-[11px] font-extrabold text-emerald-700 mb-1">✅ Surat Berhasil Dibuat!</div>
                  <div className="text-[11px] text-slate-600 space-y-0.5">
                    <div><span className="font-bold">Nama:</span> {suratData.pihakYangMenyatakan}</div>
                    <div><span className="font-bold">Desain:</span> {suratData.namaDesain}</div>
                    <div><span className="font-bold">Tanggal:</span> {suratData.tanggal}</div>
                  </div>
                </div>

                <button onClick={handleDownload}
                        disabled={!pdfReady}
                        className="btn-blue disabled:opacity-50">
                  {pdfReady ? '⬇️ Unduh PDF — Surat Pernyataan' : '⏳ Menyiapkan PDF...'}
                </button>
                <button onClick={handleReset}
                        className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-500 border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
                  🔄 Buat Surat Baru
                </button>
              </div>
            )}

            {/* Info materai */}
            <div className="info-blue !mb-0">
              <div className="text-[11px] font-extrabold text-blue-700 mb-0.5">💡 Informasi Penting</div>
              <div className="text-[11px] text-slate-500 leading-relaxed">
                Setelah diunduh, surat <strong>harus ditandatangani</strong> di atas <strong>materai Rp 10.000</strong>
                sebelum diajukan ke DJKI. Kotak materai sudah tersedia dalam dokumen PDF.
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            PANDUAN 10 LANGKAH
        ══════════════════════════════════════════════════ */}
        <div className="px-4 pt-2">
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
              <span className="text-slate-400 text-sm ml-1">{openSteps.has(s.num) ? '▲' : '▼'}</span>
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
