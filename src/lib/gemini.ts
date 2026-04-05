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

// ── Fungsi: Diagnosis HAKI dengan analisis AI ────────────────
/**
 * Analisis karya terhadap 5 kriteria penolakan HAKI
 * Digunakan oleh: src/app/api/diagnosis/route.ts
 */
export async function diagnosisHAKI(
  namaMerek: string,
  kategori: string,
  tujuan: string,
  dbMatchCount: number,
  dbHasConflict: boolean,
  fileBase64?: string,
  mimeType?: string
): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY belum diset. Tambahkan di Environment Variables Vercel');
  }

  const hasFile = !!(fileBase64 && mimeType);

  const prompt = `
Kamu adalah sistem analisis HAKI (Hak Kekayaan Intelektual) Indonesia yang profesional dan akurat.

DATA KARYA:
- Nama Merek/Karya: "${namaMerek}"
- Kategori: ${kategori}
- Tujuan Pendaftaran: ${tujuan}
- Hasil cek database PDKI: ditemukan ${dbMatchCount} kemiripan${dbHasConflict ? ', termasuk KONFLIK EKSAK' : ''}

${hasFile ? 'Analisis juga gambar/file karya yang dilampirkan.' : ''}

TUGAS: Evaluasi karya ini berdasarkan TEPAT 5 KRITERIA PENOLAKAN HAKI di Indonesia berikut.

Untuk setiap kriteria, tentukan apakah karya LOLOS atau TIDAK LOLOS, dan berikan alasan spesifik.

Kembalikan respons dalam format JSON MURNI (tanpa markdown, tanpa backtick) seperti ini:

{
  "kriteria": [
    {
      "no": 1,
      "nama": "Kemiripan dengan Merek Terdaftar",
      "status": "lolos" atau "tidak_lolos",
      "alasan": "Penjelasan spesifik dan profesional mengapa lolos atau tidak lolos",
      "detail": "Nama merek yang mirip jika ada, atau null"
    },
    {
      "no": 2,
      "nama": "Menyerupai Simbol Negara atau Lembaga Resmi",
      "status": "lolos" atau "tidak_lolos",
      "alasan": "Penjelasan spesifik",
      "detail": "Nama simbol/lembaga yang dimaksud jika ada, atau null"
    },
    {
      "no": 3,
      "nama": "Menyerupai Nama Orang Terkenal",
      "status": "lolos" atau "tidak_lolos",
      "alasan": "Penjelasan spesifik",
      "detail": "Nama tokoh yang dimaksud jika ada, atau null"
    },
    {
      "no": 4,
      "nama": "Sama dengan Nama Varietas Tanaman yang Dilindungi",
      "status": "lolos" atau "tidak_lolos",
      "alasan": "Penjelasan spesifik",
      "detail": "Nama varietas yang dimaksud jika ada, atau null"
    },
    {
      "no": 5,
      "nama": "Mirip dengan Merek Terkenal Internasional",
      "status": "lolos" atau "tidak_lolos",
      "alasan": "Penjelasan spesifik",
      "detail": "Nama merek terkenal yang dimaksud jika ada, atau null"
    }
  ],
  "lolos_count": angka 0-5 (berapa kriteria yang lolos),
  "rekomendasi_jenis_haki": "Hak Cipta" atau "Hak Cipta + Desain Industri" atau "Merek Dagang" tergantung kategori,
  "catatan_profesional": "Satu paragraf analisis profesional dan saran konkret untuk pemohon"
}

Penting: Gunakan data database PDKI yang diberikan untuk kriteria 1. Untuk kriteria 2-5, gunakan pengetahuanmu tentang simbol negara, tokoh terkenal, varietas tanaman, dan merek internasional. Jawab dalam Bahasa Indonesia yang profesional.
`.trim();

  const parts: { text?: string; inline_data?: { mime_type: string; data: string } }[] = [];

  if (hasFile) {
    parts.push({ inline_data: { mime_type: mimeType!, data: fileBase64! } });
  }
  parts.push({ text: prompt });

  const response = await fetch(
    `${GEMINI_BASE_URL}/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2000,
        },
      }),
    }
  );

  const data: GeminiResponse = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error?.message ?? `API error: ${response.status}`);
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Respons kosong dari AI');

  return text;
}

// ── Fungsi: Generate Surat Pernyataan Kepemilikan Desain Industri ──
export async function generateSuratPernyataan(data: {
  namaPemohon: string;
  kewarganegaraan?: string;
  namaBadanHukum?: string;
  alamat: string;
  tanggal: string;
  namaDesain: string;
  jenisPemohon: 'perorangan' | 'badan_hukum';
}): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY belum diset. Tambahkan di Environment Variables Vercel');
  }

  const isPerorang = data.jenisPemohon === 'perorangan';
  const namaPenandatangan = isPerorang ? data.namaPemohon : data.namaBadanHukum ?? data.namaPemohon;

  const prompt = `
Kamu adalah sistem generate dokumen legal HAKI Indonesia yang sangat presisi.
Buat teks "SURAT PERNYATAAN KEPEMILIKAN DESAIN INDUSTRI" resmi sesuai format DJKI Indonesia.

DATA INPUT:
- Nama Pemohon: ${data.namaPemohon}
- Jenis Pemohon: ${isPerorang ? 'Perorangan' : 'Badan Hukum'}
${!isPerorang ? `- Nama Badan Hukum: ${data.namaBadanHukum}` : `- Kewarganegaraan: ${data.kewarganegaraan ?? 'Indonesia'}`}
- Alamat: ${data.alamat}
- Tanggal: ${data.tanggal}
- Nama Desain Industri: ${data.namaDesain}

Hasilkan HANYA konten surat dalam format JSON murni (tanpa backtick, tanpa markdown):

{
  "pihakYangMenyatakan": "${isPerorang ? data.namaPemohon : (data.namaBadanHukum ?? data.namaPemohon)}",
  "kewarganegaraan": "${isPerorang ? (data.kewarganegaraan ?? 'Indonesia') : ''}",
  "namaBadanHukum": "${!isPerorang ? (data.namaBadanHukum ?? '') : ''}",
  "alamat": "${data.alamat}",
  "namaDesain": "${data.namaDesain}",
  "tanggal": "${data.tanggal}",
  "isPerorang": ${isPerorang},
  "namaPenandatangan": "${namaPenandatangan}",
  "pernyataan1": "Satu kalimat pernyataan formal bahwa desain industri berjudul '${data.namaDesain}' adalah milik ${isPerorang ? 'saya' : 'kami'}, dimana desain industri tersebut adalah desain yang memiliki nilai kebaruan dan tidak sama dengan pengungkapan desain industri sebelumnya.",
  "pernyataan2": "Satu kalimat pernyataan formal bahwa desain industri pada angka 1 tersebut di atas tidak pernah dan tidak dalam sengketa, baik pidana dan/atau perdata di peradilan."
}
`.trim();

  const response = await fetch(
    `${GEMINI_BASE_URL}/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 1000 },
      }),
    }
  );

  const result: GeminiResponse = await response.json();
  if (!response.ok || result.error) {
    throw new Error(result.error?.message ?? `API error: ${response.status}`);
  }
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Respons kosong dari AI');
  return text;
}
