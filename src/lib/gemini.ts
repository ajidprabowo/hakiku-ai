// ══════════════════════════════════════════════════════════════
// HAKIKU — Gemini AI Helper
// src/lib/gemini.ts
//
// ⚠️ File ini HANYA digunakan di server (API routes)
// Jangan import di komponen client ('use client')
// API key aman karena hanya ada di server
// ══════════════════════════════════════════════════════════════

const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-3-flash-preview';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? '';

// Base URL Gemini API
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

// ── System Prompt ─────────────────────────────────────────────
export const HAKI_SYSTEM_PROMPT = `
Kamu adalah HAKIKU AI — asisten konsultasi HAKI (Hak Kekayaan Intelektual) Indonesia yang ramah dan ahli.

TENTANG KAMU:
- Kamu adalah bagian dari platform HAKIKU, platform konsultasi HAKI digital Indonesia
- Kamu membantu pelaku UMKM, kreator, dan pengrajin memahami dan mendaftarkan HAKI
- Fokus pada 2 sub-sektor: Kriya & Kerajinan, dan Desain Grafis & Visual

CARA MENJAWAB:
- Gunakan bahasa Indonesia yang MUDAH DIPAHAMI orang awam — hindari jargon hukum
- Selalu sertakan info praktis: biaya, waktu proses, portal DJKI yang relevan
- Gunakan emoji untuk membuat jawaban lebih menarik dan mudah dibaca
- Berikan contoh konkret yang relevan untuk UMKM Indonesia
- Jika ada risiko atau hal penting, beri peringatan dengan jelas

REFERENSI BIAYA (PP No. 45 Tahun 2024):
- Hak Cipta UMKM: Rp 200.000 | Umum: Rp 400.000
- Desain Industri UMKM: Rp 250.000 | Umum: Rp 800.000
- Merek UMKM: Rp 500.000/kelas | Umum: Rp 1.800.000/kelas
- Materai: Rp 10.000

PORTAL DJKI RESMI:
- Hak Cipta: e-hakcipta.dgip.go.id
- Merek: merek.dgip.go.id
- Cek Database: pdki-indonesia.dgip.go.id
- Call center: 152
`.trim();

// ── Type Definitions ──────────────────────────────────────────
interface GeminiPart {
  text?: string;
  inline_data?: {
    mime_type: string;
    data: string;
  };
}

interface GeminiContent {
  role: 'user' | 'model';
  parts: GeminiPart[];
}

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: { text?: string }[];
    };
  }[];
  error?: {
    message?: string;
    code?: number;
  };
}

// ── Fungsi: Chat AI ───────────────────────────────────────────
/**
 * Kirim pesan ke Gemini dan dapatkan respons teks
 * Digunakan oleh: src/app/api/chat/route.ts
 */
export async function chatWithGemini(
  userMessage: string,
  history: { role: 'user' | 'model'; text: string }[] = []
): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY belum diset. Tambahkan di Environment Variables Vercel');
  }

  // Susun history + system prompt
  const contents: GeminiContent[] = [
    // Inject system prompt sebagai turn pertama
    { role: 'user',  parts: [{ text: `${HAKI_SYSTEM_PROMPT}\n\nPahami instruksi di atas.` }] },
    { role: 'model', parts: [{ text: 'Saya memahami. Saya siap membantu sebagai HAKIKU AI konsultan HAKI Indonesia.' }] },
    // History percakapan sebelumnya
    ...history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }],
    })),
    // Pesan user sekarang
    { role: 'user', parts: [{ text: userMessage }] },
  ];

  const response = await fetch(
    `${GEMINI_BASE_URL}/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
          topP: 0.8,
        },
      }),
    }
  );

  const data: GeminiResponse = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error?.message ?? `API error: ${response.status}`);
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Respons kosong dari Gemini');

  return text;
}

// ── Fungsi: Review Dokumen ────────────────────────────────────
/**
 * Review dokumen yang diupload menggunakan Gemini Vision
 * Digunakan oleh: src/app/api/review/route.ts
 */
export async function reviewDocumentWithGemini(
  fileBase64: string,
  mimeType: string,
  docType: string
): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY belum diset. Tambahkan di Environment Variables Vercel');
  }

  const prompt = `
Kamu adalah konsultan HKI berlisensi DJKI Indonesia yang berpengalaman.
Review dokumen "${docType}" yang diunggah user untuk keperluan pendaftaran HAKI.

Berikan analisis dalam format berikut (bahasa Indonesia yang mudah dipahami):

## 1. Kelengkapan Dokumen
Apakah dokumen sudah lengkap untuk pendaftaran HAKI?

## 2. Kekuatan Dokumen
Apa saja yang sudah baik dari dokumen ini?

## 3. Yang Perlu Diperbaiki
Apa yang perlu dilengkapi atau diperbaiki sebelum submit?

## 4. Rekomendasi Langkah Selanjutnya
Langkah konkret yang harus dilakukan sebelum submit ke DJKI.

## 5. Estimasi Peluang Lolos DJKI
Berikan estimasi persentase peluang diterima.

Berikan jawaban yang ramah, praktis, dan mudah dipahami orang awam. Gunakan emoji untuk kejelasan.
`.trim();

  const response = await fetch(
    `${GEMINI_BASE_URL}/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [
            { inline_data: { mime_type: mimeType, data: fileBase64 } },
            { text: prompt },
          ],
        }],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 1500,
        },
      }),
    }
  );

  const data: GeminiResponse = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error?.message ?? `API error: ${response.status}`);
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Respons kosong dari Gemini');

  return text;
}
