'use client';

// ══════════════════════════════════════════════════════════════
// HAKIKU — Navbar Component
// src/components/Navbar.tsx
// ══════════════════════════════════════════════════════════════

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/',            label: 'Beranda'    },
  { href: '/diagnosis',   label: 'Diagnosis'  },
  { href: '/konsultasi',  label: 'Konsultasi' },
  { href: '/dashboard',   label: 'Dashboard'  },
  { href: '/dokumen',     label: 'Dokumen'    },
  { href: '/edukasi',     label: 'Edukasi'    },
];

export default function Navbar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showMenu, setShowMenu]     = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    setShowMenu(false);
    try {
      await fetch('/api/auth', { method: 'DELETE' });
    } finally {
      router.push('/login');
      router.refresh();
    }
  }

  return (
    <nav className="h-14 bg-white border-b-2 border-slate-200 flex items-center justify-between px-4 flex-shrink-0 z-50 relative"
         style={{ boxShadow: '0 2px 12px rgba(27,79,216,0.06)' }}>

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 flex-shrink-0">
        <Image src="/logo.png" alt="HAKIKU" width={120} height={42}
               className="object-contain h-9 w-auto" priority />
      </Link>

      {/* Desktop Nav Tabs */}
      <div className="flex gap-0.5 overflow-x-auto scroll-x-hidden flex-1 justify-center mx-2">
        {NAV_ITEMS.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href}
                  className={[
                    'px-2.5 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all duration-150',
                    isActive ? 'bg-blue-700 text-white' : 'text-slate-500 hover:bg-blue-50 hover:text-blue-700',
                  ].join(' ')}>
              {label}
            </Link>
          );
        })}
      </div>

      {/* User Menu */}
      <div className="relative flex-shrink-0">
        <button
          onClick={() => setShowMenu(v => !v)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-150">
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black text-white flex-shrink-0"
               style={{ background: 'linear-gradient(135deg,#1B4FD8,#F97316)' }}>
            👤
          </div>
          <span className="text-[10px] font-bold text-slate-600 hidden sm:block">Akun</span>
          <span className="text-[9px] text-slate-400">{showMenu ? '▲' : '▼'}</span>
        </button>

        {/* Dropdown */}
        {showMenu && (
          <>
            {/* Overlay */}
            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />

            {/* Menu */}
            <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-slate-200 rounded-xl overflow-hidden z-50"
                 style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
              <div className="px-3 py-2.5 border-b border-slate-100"
                   style={{ background: 'linear-gradient(135deg,#EFF6FF,#FFF7ED)' }}>
                <div className="text-[10px] text-slate-400 font-semibold">Masuk sebagai</div>
                <div className="text-xs font-extrabold text-slate-800 truncate">Administrator</div>
              </div>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-red-50 transition-colors duration-150 disabled:opacity-50">
                <span className="text-sm">🚪</span>
                <span className="text-[11px] font-bold text-red-600">
                  {loggingOut ? 'Keluar...' : 'Keluar'}
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
