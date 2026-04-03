// ══════════════════════════════════════════════════════════════
// HAKIKU — API Route: Auth (Login & Logout)
// src/app/api/auth/route.ts
// POST /api/auth        → login
// DELETE /api/auth      → logout
// ══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';

const VALID_USERNAME = process.env.HAKIKU_USERNAME ?? 'admin';
const VALID_PASSWORD = process.env.HAKIKU_PASSWORD ?? 'hakiku2026';

const COOKIE_NAME    = 'hakiku_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 hari

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password wajib diisi.' }, { status: 400 });
    }

    // Validasi kredensial
    const isValid =
      username.trim() === VALID_USERNAME &&
      password === VALID_PASSWORD;

    if (!isValid) {
      // Delay kecil untuk mencegah brute force
      await new Promise(r => setTimeout(r, 500));
      return NextResponse.json({ error: 'Username atau password salah.' }, { status: 401 });
    }

    // Set session cookie
    const response = NextResponse.json({ success: true, username: VALID_USERNAME });
    response.cookies.set(COOKIE_NAME, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return response;
}
