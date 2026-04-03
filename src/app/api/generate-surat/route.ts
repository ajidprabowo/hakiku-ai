// ══════════════════════════════════════════════════════════════
// HAKIKU — API Route: Generate Surat Pernyataan Kepemilikan
// src/app/api/generate-surat/route.ts
// POST /api/generate-surat
// ══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { generateSuratPernyataan } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { namaPemohon, kewarganegaraan, namaBadanHukum, alamat, tanggal, namaDesain, jenisPemohon } = body;

    if (!namaPemohon || !alamat || !tanggal || !namaDesain || !jenisPemohon) {
      return NextResponse.json({ error: 'Semua field wajib harus diisi.' }, { status: 400 });
    }

    const rawResult = await generateSuratPernyataan({
      namaPemohon, kewarganegaraan, namaBadanHukum,
      alamat, tanggal, namaDesain, jenisPemohon,
    });

    const cleaned = rawResult.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed  = JSON.parse(cleaned);

    return NextResponse.json({ data: parsed });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan';
    if (message.includes('API_KEY')) {
      return NextResponse.json(
        { error: 'API key belum dikonfigurasi. Tambahkan GEMINI_API_KEY di Environment Variables Vercel' },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: `Gagal generate surat: ${message}` }, { status: 500 });
  }
}
