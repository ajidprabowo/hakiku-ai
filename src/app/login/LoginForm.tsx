'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [mounted, setMounted]   = useState(false);

  useEffect(() => { setMounted(true); }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Username dan password wajib diisi.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res  = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error ?? 'Login gagal. Silakan coba lagi.');
        return;
      }
      const from = searchParams.get('from') ?? '/';
      router.push(from);
      router.refresh();
    } catch {
      setError('Gagal terhubung ke server. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden"
         style={{ background: 'linear-gradient(135deg, #0B2D96 0%, #1B4FD8 55%, #F97316 100%)' }}>

      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
           style={{ background: 'rgba(249,115,22,0.18)', filter: 'blur(70px)', transform: 'translate(35%,-35%)' }} />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full pointer-events-none"
           style={{ background: 'rgba(255,255,255,0.12)', filter: 'blur(70px)', transform: 'translate(-35%,35%)' }} />

      {/* Card */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl overflow-hidden animate-fade-up"
           style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.28)' }}>

        {/* Top gradient bar */}
        <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg,#1B4FD8,#F97316)' }} />

        <div className="px-6 pt-7 pb-8">

          {/* Logo + Heading */}
          <div className="flex flex-col items-center mb-7">
            <Image src="/logo.png" alt="HAKIKU" width={130} height={46}
                   className="object-contain h-11 w-auto mb-4" priority />
            <h1 className="font-display text-xl font-black text-slate-900 mb-1 text-center">
              Selamat Datang
            </h1>
            <p className="text-xs text-slate-500 text-center leading-relaxed">
              Masuk untuk mengakses platform<br />konsultasi HAKI Indonesia
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4" noValidate>

            {/* Username field */}
            <div>
              <label htmlFor="username" className="text-[11px] font-bold text-slate-600 block mb-1.5">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none select-none">👤</span>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  autoFocus
                  spellCheck={false}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
                  placeholder="Masukkan username Anda"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError(''); }}
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="text-[11px] font-bold text-slate-600 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none select-none">🔒</span>
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
                  placeholder="Masukkan password Anda"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors text-sm">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl border border-red-200 bg-red-50 animate-fade-up">
                <span className="text-sm flex-shrink-0 mt-0.5">❌</span>
                <p className="text-[11px] font-bold text-red-700 leading-relaxed">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || !username.trim() || !password}
              className="w-full py-3 rounded-xl font-display text-sm font-bold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] mt-1"
              style={{
                background: (loading || !username.trim() || !password) ? '#94a3b8' : 'linear-gradient(135deg,#1B4FD8,#F97316)',
                boxShadow: (loading || !username.trim() || !password) ? 'none' : '0 6px 20px rgba(27,79,216,0.35)',
              }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-flex gap-1">
                    <span className="typing-dot w-1.5 h-1.5" />
                    <span className="typing-dot w-1.5 h-1.5" />
                    <span className="typing-dot w-1.5 h-1.5" />
                  </span>
                  Memverifikasi...
                </span>
              ) : 'Masuk ke HAKIKU →'}
            </button>
          </form>

          {/* Divider + footer */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center space-y-1">
            <p className="text-[10px] text-slate-400">
              Platform Konsultasi HAKI Indonesia
            </p>
            <p className="text-[10px] font-bold text-slate-500">
              HAKIKU · Berlisensi DJKI 2026
            </p>
          </div>
        </div>
      </div>

      <p className="mt-5 text-[11px] text-center" style={{ color: 'rgba(255,255,255,0.55)' }}>
        Solusi HAKI Cerdas untuk Kreator Indonesia
      </p>
    </div>
  );
}
