# HAKIKU v2.0 — Solusi Pendaftaran HAKI yang Lebih Cerdas dan Pasti

Platform konsultasi HAKI berbasis AI untuk pelaku UMKM dan kreator Indonesia.
Dibangun dengan **Next.js 14**, **Tailwind CSS**, dan **Google Gemini AI**.

---

## Struktur Project

```
hakiku/
├── src/
│   ├── app/                         ← Next.js App Router
│   │   ├── api/
│   │   │   ├── chat/route.ts        ← API: AI Chat (server-side)
│   │   │   └── review/route.ts      ← API: Review Dokumen (server-side)
│   │   ├── diagnosis/page.tsx       ← Halaman Diagnosis HAKI
│   │   ├── hasil/page.tsx           ← Halaman Hasil Rekomendasi
│   │   ├── konsultasi/page.tsx      ← Halaman Konsultasi (Chat AI + Review)
│   │   ├── dashboard/page.tsx       ← Halaman Dashboard Kreator
│   │   ├── dokumen/page.tsx         ← Halaman Upload & Tracker Dokumen
│   │   ├── edukasi/page.tsx         ← Halaman 14 Modul Edukasi
│   │   ├── globals.css              ← Global styles + Tailwind
│   │   ├── layout.tsx               ← Root layout + metadata
│   │   └── page.tsx                 ← Halaman Beranda (Landing)
│   ├── components/
│   │   ├── Navbar.tsx               ← Top navigation bar
│   │   ├── BottomNav.tsx            ← Bottom navigation (mobile)
│   │   └── MarkdownRenderer.tsx     ← Render respons AI (markdown)
│   ├── data/
│   │   ├── hki-database.ts          ← 57 data PDKI DJKI + search function
│   │   ├── modules.ts               ← 14 modul edukasi HAKI
│   │   ├── consultants.ts           ← Data konsultan KI berlisensi
│   │   └── pricing.ts               ← Biaya PNBP PP No. 45/2024
│   ├── lib/
│   │   ├── gemini.ts                ← Gemini API helper (server only)
│   │   └── utils.ts                 ← Utility functions
│   └── types/
│       └── index.ts                 ← TypeScript type definitions
├── public/
│   └── logo.png                     ← Logo HAKIKU
├── .env.example                     ← Template environment variables
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## Setup (Step-by-Step)

### 1. Install dependencies
```bash
npm install
```

### 2. Dapatkan Gemini API Key (GRATIS)
1. Buka [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Klik **"Create API Key"**
3. Copy API key yang muncul

### 3. Buat file `.env.local`
```bash
cp .env.example .env.local
```

Buka `.env.local` dan isi:
```
GEMINI_API_KEY=paste_api_key_kamu_di_sini
GEMINI_MODEL=gemini-2.0-flash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=HAKIKU
```

### 4. Jalankan development server
```bash
npm run dev
```

Buka browser ke **http://localhost:3000**

---

## Deploy ke Vercel (Gratis)

1. Push project ke GitHub
2. Buka [https://vercel.com/new](https://vercel.com/new)
3. Import repository GitHub
4. Di bagian **Environment Variables**, tambahkan:
   - `GEMINI_API_KEY` = API key Gemini kamu
   - `GEMINI_MODEL` = `gemini-2.0-flash`
5. Klik **Deploy** ✅

---

## Fitur Utama

| Halaman | Fitur |
|---------|-------|
| 🏠 Beranda | Landing page, trust signals, persona selector, testimonial |
| 🔍 Diagnosis | 3-step flow: pilih kategori → cek database PDKI → tujuan |
| ✅ Hasil | Rekomendasi HAKI + estimasi % lolos berbasis database real |
| 💬 Konsultasi | **AI Chat** (Gemini real), 3 konsultan berlisensi, **Review Dokumen AI** |
| 📊 Dashboard | Portofolio HAKI, saran AI, quick stats |
| 📋 Dokumen | Upload real per dokumen, checklist real-time, 10 langkah DJKI |
| 📚 Edukasi | 14 modul, 6 filter aktif, kalkulator biaya PP 45/2024 |

---

## Keamanan API Key

✅ `GEMINI_API_KEY` hanya ada di server (API routes)
✅ Tidak pernah dikirim ke browser client
✅ `.env.local` tidak masuk ke Git (ada di `.gitignore`)

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS (tanpa library tambahan) |
| AI | Google Gemini 2.0 Flash |
| Font | Plus Jakarta Sans + Syne |
| Deploy | Vercel |

---

*HAKIKU — PIDI DIGDAYA x HACKATHON 2026 · Bank Indonesia & OJK*
