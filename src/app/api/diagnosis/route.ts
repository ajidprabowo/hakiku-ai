// ══════════════════════════════════════════════════════════════
// HAKIKU — API Route: Diagnosis HAKI dengan AI
// src/app/api/diagnosis/route.ts
//
// POST /api/diagnosis
// Body: FormData { namaMerek, kategori, tujuan, dbMatchCount,
//                  dbHasConflict, file? }
// Returns: { result: DiagnosisAIResult } | { error: string }
// ══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { diagnosisHAKI } from '@/lib/gemini';

const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData    = await request.formData();
    const namaMerek   = formData.get('namaMerek') as string;
    const kategori    = formData.get('kategori') as string;
    const tujuan      = formData.get('tujuan') as string;
    const dbMatchCount  = parseInt(formData.get('dbMatchCount') as string ?? '0');
    const dbHasConflict = formData.get('dbHasConflict') === 'true';
    const file        = formData.get('file') as File | null;

    if (!namaMerek || !kategori || !tujuan) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    let fileBase64: string | undefined;
    let mimeType: string | undefined;

    if (file) {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json({ error: 'Format file tidak didukung. Gunakan PDF, JPG, atau PNG.' }, { status: 400 });
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: 'Ukuran file melebihi 10 MB.' }, { status: 400 });
      }
      const arrayBuffer = await file.arrayBuffer();
      fileBase64 = Buffer.from(arrayBuffer).toString('base64');
      mimeType   = file.type;
    }

    const rawResult = await diagnosisHAKI(
      namaMerek, kategori, tujuan,
      dbMatchCount, dbHasConflict,
      fileBase64, mimeType
    );

    // Clean JSON response (strip markdown fences if any)
    const cleaned = rawResult.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed  = JSON.parse(cleaned);

    return NextResponse.json({ result: parsed });

  } catch (error) {
    console.error('[API /diagnosis] Error:', error);
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan';

    if (message.includes('API_KEY')) {
      return NextResponse.json(
        { error: 'API key belum dikonfigurasi. Tambahkan GEMINI_API_KEY di Environment Variables Vercel' },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: `Analisis gagal: ${message}` }, { status: 500 });
  }
}
