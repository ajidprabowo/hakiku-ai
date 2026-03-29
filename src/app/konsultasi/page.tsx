'use client';

// ══════════════════════════════════════════════════════════════
// HAKIKU — Halaman Konsultasi
// src/app/konsultasi/page.tsx
// ══════════════════════════════════════════════════════════════

import { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { CONSULTANTS, CONSULTATION_PRICING } from '@/data/consultants';
import { formatFileSize } from '@/lib/utils';
import type { KonsultasiTab, ChatMessage } from '@/types';

const DOC_TYPES = [
  'Surat Pernyataan Kepemilikan',
  'Deskripsi Karya',
  'Foto/Scan Karya',
  'Dokumen Merek (Logo/Desain)',
  'Dokumen Desain Industri',
  'Dokumen Lainnya',
];

export default function KonsultasiPage() {
  const [tab, setTab] = useState<KonsultasiTab>('chat');
  const [hasDiagnosis] = useState(() => typeof window !== 'undefined' && !!sessionStorage.getItem('diagnosisResult'));

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', text: 'Halo! Saya HAKIKU AI 👋 Saya siap menjawab semua pertanyaan Anda seputar HAKI — biaya, proses, jenis HAKI, tips lolos, dan banyak lagi. Apa yang ingin Anda tanyakan?' },
    { role: 'ai', text: '💬 Coba tanyakan: "Berapa biaya merek UMKM?", "Berapa lama proses hak cipta?", atau "Apa beda hak cipta dan merek?"' },
  ]);
  const [chatInput, setChatInput]   = useState('');
  const [isTyping, setIsTyping]     = useState(false);
  const msgsRef = useRef<HTMLDivElement>(null);

  // Review state
  const [reviewFile, setReviewFile]       = useState<File | null>(null);
  const [docType, setDocType]             = useState(DOC_TYPES[0]);
  const [reviewResult, setReviewResult]   = useState('');
  const [reviewing, setReviewing]         = useState(false);
  const reviewInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // ── Kirim pesan chat ────────────────────────────────────────
  async function sendMessage() {
    const text = chatInput.trim();
    if (!text || isTyping) return;
    setChatInput('');
    setMessages(m => [...m, { role: 'user', text }]);
    setIsTyping(true);

    try {
      const history = messages
        .filter(m => m.role !== 'ai' || messages.indexOf(m) > 0)
        .map(m => ({ role: m.role === 'ai' ? 'model' as const : 'user' as const, text: m.text }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await res.json();
      setMessages(m => [...m, { role: 'ai', text: data.reply || data.error || 'Tidak ada respons.' }]);
    } catch {
      setMessages(m => [...m, { role: 'ai', text: '❌ Gagal terhubung ke AI. Pastikan Anda terhubung ke internet dan coba lagi.' }]);
    } finally {
      setIsTyping(false);
    }
  }

  // ── Review dokumen dengan AI ────────────────────────────
  async function handleReview() {
    if (!reviewFile || reviewing) return;
    setReviewing(true);
    setReviewResult('');

    try {
      const formData = new FormData();
      formData.append('file', reviewFile);
      formData.append('docType', docType);

      const res = await fetch('/api/review', { method: 'POST', body: formData });
      const data = await res.json();
      setReviewResult(data.result || data.error || 'Tidak ada hasil review.');
    } catch {
      setReviewResult('❌ Review gagal. Pastikan Anda terhubung ke internet dan coba lagi.');
    } finally {
      setReviewing(false);
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />

      <main className="flex-1 flex flex-col overflow-hidden">

        {/* ── Hero ──────────────────────────────────────────── */}
        <div className="hero-section flex-shrink-0">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2"
                  style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.9)' }}>
              💬 Konsultasi HAKI
            </span>
            <h1 className="font-display text-xl text-white font-bold mb-1">Tanya Ahli HAKI Berlisensi</h1>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>Pilih mode konsultasi sesuai kebutuhan Anda</p>
          </div>
        </div>

        {/* ── Tabs ──────────────────────────────────────────── */}
        <div className="flex gap-px mx-4 mt-3 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200">
          {([['chat','🤖 Chat AI'],['human','👤 Konsultan'],['review','📄 Review Dokumen']] as [KonsultasiTab, string][]).map(([t, lbl]) => (
            <button key={t} onClick={() => setTab(t)}
                    className={[
                      'flex-1 py-2 text-[11px] font-bold transition-all duration-150 border-none cursor-pointer font-sans',
                      tab === t ? 'text-white' : 'bg-white text-slate-400 hover:bg-slate-50',
                    ].join(' ')}
                    style={tab === t ? { background: 'linear-gradient(135deg,#1B4FD8,#F97316)' } : {}}>
              {lbl}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════
            TAB: CHAT AI
        ══════════════════════════════════════════════════════ */}
        {tab === 'chat' && (
          <div className="flex-1 flex flex-col overflow-hidden mx-4 mt-3 mb-1 border border-slate-200 rounded-xl overflow-hidden"
               style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>

            {/* Chat header */}
            <div className="flex items-center gap-2.5 px-4 py-3 flex-shrink-0"
                 style={{ background: 'linear-gradient(135deg,#1B4FD8,#2563EB,#F97316)' }}>
              <span className="text-xl">🤖</span>
              <div className="flex-1">
                <div className="text-xs font-extrabold text-white">HAKIKU AI — Powered by AI</div>
                <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.75)' }}>Gratis · Respons instan · Siap 24/7</div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>GRATIS</span>
            </div>

            {/* Messages */}
            <div ref={msgsRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50">
              {messages.map((msg, i) =>
                msg.role === 'ai' ? (
                  <div key={i} className="flex gap-2 items-start animate-fade-up">
                    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-black text-white"
                         style={{ background: 'linear-gradient(135deg,#1B4FD8,#F97316)' }}>AI</div>
                    <div className="bubble-bot">
                      <MarkdownRenderer content={msg.text} />
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex justify-end animate-fade-up">
                    <div className="bubble-user">{msg.text}</div>
                  </div>
                )
              )}
              {isTyping && (
                <div className="flex gap-2 items-start">
                  <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-black text-white"
                       style={{ background: 'linear-gradient(135deg,#1B4FD8,#F97316)' }}>AI</div>
                  <div className="bubble-bot">
                    <div className="flex gap-1 py-0.5">
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2 px-3 py-2.5 bg-white border-t border-slate-200 flex-shrink-0">
              <input
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500"
                placeholder="Tanya seputar HAKI..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              />
              <button onClick={sendMessage} disabled={isTyping || !chatInput.trim()}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm flex-shrink-0 disabled:opacity-50"
                      style={{ background: 'linear-gradient(135deg,#1B4FD8,#F97316)', boxShadow: '0 2px 8px rgba(27,79,216,0.3)' }}>
                ➤
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TAB: KONSULTAN MANUSIA
        ══════════════════════════════════════════════════════ */}
        {tab === 'human' && (
          <div className="flex-1 screen-container pb-2">
            {hasDiagnosis && (
              <div className="info-green mx-4 mt-3">
                <div className="text-[11px] font-extrabold text-emerald-700 mb-0.5">✅ Briefing otomatis terkirim</div>
                <div className="text-[11px] text-slate-500">Hasil diagnosis Anda sudah dikirim ke konsultan sebagai konteks awal.</div>
              </div>
            )}

            {CONSULTANTS.map((k) => (
              <div key={k.name} className="mx-4 mb-3 bg-white border border-slate-200 rounded-xl overflow-hidden"
                   style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
                {/* Top section */}
                <div className="flex gap-3 p-4 items-start">
                  <div className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center font-display text-lg font-black text-white"
                       style={{ background: k.gradient }}>
                    {k.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-extrabold text-slate-900 mb-0.5">{k.name}</div>
                    <div className="text-[10px] font-bold mb-0.5" style={{ color: '#F97316' }}>{k.credential}</div>
                    <div className="text-[11px] text-slate-500 mb-1">{k.specialization}</div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-yellow-400 text-xs">{k.stars}</span>
                      <span className="text-[11px] text-slate-500 font-semibold">{k.rating}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    k.availability === 'online' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>{k.availabilityText}</span>
                </div>

                {/* Pricing row */}
                <div className="grid grid-cols-3 border-t border-slate-100">
                  {Object.values(CONSULTATION_PRICING).map(({ label, price, free }) => (
                    <div key={label} className="py-2 px-3 text-center border-r border-slate-100 last:border-r-0">
                      <div className="text-[9px] text-slate-400 font-semibold mb-0.5">{label}</div>
                      <div className={`text-xs font-extrabold ${free ? 'text-emerald-600' : 'text-slate-800'}`}>{price}</div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 p-3 bg-slate-50 border-t border-slate-100">
                  <button className="flex-1 py-2 rounded-xl text-[11px] font-extrabold text-white"
                          style={{ background: 'linear-gradient(135deg,#1B4FD8,#3B82F6)' }}>
                    💬 Chat Sekarang
                  </button>
                  <button className="flex-1 py-2 rounded-xl text-[11px] font-extrabold text-orange-700 bg-orange-50 hover:bg-orange-100 relative">
                    📹 Video Call
                    <span className="absolute -top-2 -right-1 text-[8px] font-black bg-amber-400 text-white px-1.5 py-0.5 rounded-full">Segera</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TAB: REVIEW DOKUMEN
        ══════════════════════════════════════════════════════ */}
        {tab === 'review' && (
          <div className="flex-1 screen-container px-4 pb-4">
            <div className="card mt-3">
              <div className="text-sm font-extrabold text-slate-800 mb-1">📄 Review Dokumen oleh AI HAKIKU</div>
              <div className="text-xs text-slate-500 leading-relaxed mb-4">
                Unggah dokumen HAKI Anda (PDF, JPG, PNG) untuk direview langsung oleh AI.
                AI akan menganalisis kelengkapan dan memberikan rekomendasi perbaikan.
              </div>

              {/* Jenis dokumen */}
              <label className="text-[11px] font-bold text-slate-600 block mb-1.5">Jenis Dokumen:</label>
              <select
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 bg-slate-50 outline-none mb-4"
                value={docType} onChange={e => setDocType(e.target.value)}>
                {DOC_TYPES.map(d => <option key={d}>{d}</option>)}
              </select>

              {/* Upload zone */}
              <input ref={reviewInputRef} type="file" className="hidden"
                     accept=".pdf,.jpg,.jpeg,.png"
                     onChange={e => {
                       const f = e.target.files?.[0] ?? null;
                       if (f && f.size > 10 * 1024 * 1024) {
                         alert('Ukuran file melebihi 10 MB. Silakan pilih file yang lebih kecil.');
                         return;
                       }
                       setReviewFile(f);
                     }} />
              <div
                onClick={() => reviewInputRef.current?.click()}
                className={`upload-zone ${reviewFile ? 'filled' : ''}`}>
                {reviewFile ? (
                  <>
                    <div className="text-2xl mb-1.5">✅</div>
                    <div className="text-xs font-bold text-emerald-700">File Berhasil Diunggah!</div>
                    <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-lg border border-emerald-400 bg-white text-[11px] font-bold text-emerald-700">
                      📄 {reviewFile.name}
                      <span className="text-slate-400">({formatFileSize(reviewFile.size)})</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">Klik untuk ganti file</div>
                  </>
                ) : (
                  <>
                    <div className="text-3xl mb-2">📁</div>
                    <div className="text-xs font-bold text-blue-700">Klik untuk Mengunggah Dokumen</div>
                    <div className="text-[10px] text-slate-400 mt-1">PDF, JPG, PNG · Maks 10MB</div>
                  </>
                )}
              </div>

              {reviewFile && (
                <button onClick={handleReview} disabled={reviewing}
                        className="btn-blue mt-3 disabled:opacity-60">
                  {reviewing ? '⏳ AI Sedang Menganalisis Dokumen...' : '🔍 Analisis Dokumen dengan AI'}
                </button>
              )}
            </div>

            {/* Review Result */}
            {(reviewing || reviewResult) && (
              <div className="border-2 border-blue-600 rounded-2xl overflow-hidden mt-1"
                   style={{ boxShadow: '0 8px 32px rgba(27,79,216,0.15)' }}>
                <div className="flex items-center gap-2 px-4 py-3"
                     style={{ background: 'linear-gradient(135deg,#1B4FD8,#F97316)' }}>
                  <span className="text-base">🤖</span>
                  <span className="text-xs font-extrabold text-white">Hasil Analisis Dokumen AI</span>
                </div>
                <div className="p-4 bg-white">
                  {reviewing ? (
                    <div className="space-y-2">
                      {[100, 80, 60].map(w => (
                        <div key={w} className="skeleton" style={{ width: `${w}%` }} />
                      ))}
                    </div>
                  ) : (
                    <MarkdownRenderer content={reviewResult} />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
