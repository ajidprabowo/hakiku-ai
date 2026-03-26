// ══════════════════════════════════════════════════════════════
// HAKIKU — API Route: Review Dokumen dengan AI
// src/app/api/review/route.ts
//
// POST /api/review
// Body: FormData { file: File, docType: string }
// Returns: { result: string } | { error: string }
//
// ⚠️ API key Gemini AMAN di sini — hanya berjalan di server
// ══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { reviewDocumentWithGemini } from '@/lib/gemini';

// Tipe file yang diizinkan untuk direview
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

// Batas ukuran file: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    // Parse FormData (karena ada file upload)
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const docType = formData.get('docType') as string | null;

    // Validasi: file harus ada
    if (!file) {
      return NextResponse.json(
        { error: 'File dokumen wajib diunggah' },
        { status: 400 }
      );
    }

    // Validasi: tipe file
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Tipe file tidak didukung. Gunakan: PDF, JPG, PNG, atau WebP` },
        { status: 400 }
      );
    }

    // Validasi: ukuran file
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Ukuran file terlalu besar. Maksimal 10MB' },
        { status: 400 }
      );
    }

    // Convert file ke base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    // Panggil Gemini AI untuk review
    const result = await reviewDocumentWithGemini(
      base64,
      file.type,
      docType ?? 'Dokumen HAKI'
    );

    return NextResponse.json({ result });

  } catch (error) {
    console.error('[API /review] Error:', error);

    const message = error instanceof Error ? error.message : 'Terjadi kesalahan';

    if (message.includes('API_KEY')) {
      return NextResponse.json(
        { error: 'API key belum dikonfigurasi. Tambahkan GEMINI_API_KEY di Environment Variables Vercel' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: `Review dokumen gagal: ${message}` },
      { status: 500 }
    );
  }
}
