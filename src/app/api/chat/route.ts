// ══════════════════════════════════════════════════════════════
// HAKIKU — API Route: Chat AI
// src/app/api/chat/route.ts
//
// POST /api/chat
// Body: { message: string, history?: [{role, text}] }
// Returns: { reply: string } | { error: string }
//
// ⚠️ API key Gemini AMAN di sini — hanya berjalan di server
// ══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { chatWithGemini } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { message, history = [] } = body;

    // Validasi input
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Pesan tidak boleh kosong' },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'Pesan terlalu panjang (maks 2000 karakter)' },
        { status: 400 }
      );
    }

    // Panggil Gemini AI
    const reply = await chatWithGemini(message, history);

    return NextResponse.json({ reply });

  } catch (error) {
    console.error('[API /chat] Error:', error);

    const message = error instanceof Error ? error.message : 'Terjadi kesalahan';

    // Pesan error yang ramah untuk user
    if (message.includes('API_KEY')) {
      return NextResponse.json(
        { error: 'API key belum dikonfigurasi. Tambahkan GEMINI_API_KEY di Environment Variables Vercel' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: `Gagal mendapatkan respons AI: ${message}` },
      { status: 500 }
    );
  }
}
