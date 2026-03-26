'use client';

// ══════════════════════════════════════════════════════════════
// HAKIKU — Bottom Navigation (Mobile)
// src/components/BottomNav.tsx
// ══════════════════════════════════════════════════════════════

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const BOTTOM_NAV = [
  { href: '/',           icon: '🏠', label: 'Beranda'    },
  { href: '/diagnosis',  icon: '🔍', label: 'Diagnosis'  },
  { href: '/dashboard',  icon: '📊', label: 'Dashboard'  },
  { href: '/konsultasi', icon: '💬', label: 'Konsultasi' },
  { href: '/edukasi',    icon: '📚', label: 'Edukasi'    },
];

// Map path ke bottom nav item yang aktif
const ACTIVE_MAP: Record<string, string> = {
  '/':            '/',
  '/diagnosis':   '/diagnosis',
  '/hasil':       '/diagnosis',
  '/konsultasi':  '/konsultasi',
  '/dashboard':   '/dashboard',
  '/dokumen':     '/dashboard',
  '/edukasi':     '/edukasi',
};

export default function BottomNav() {
  const pathname = usePathname();
  const activeHref = ACTIVE_MAP[pathname] ?? pathname;

  return (
    <nav className="h-14 bg-white border-t-2 border-slate-200 flex flex-shrink-0"
         style={{ boxShadow: '0 -2px 12px rgba(0,0,0,0.05)' }}>
      {BOTTOM_NAV.map(({ href, icon, label }) => {
        const isActive = activeHref === href;
        return (
          <Link
            key={href}
            href={href}
            className={[
              'flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-colors duration-150',
              isActive ? '' : 'hover:bg-blue-50',
            ].join(' ')}
          >
            <span className="text-lg leading-none">{icon}</span>
            <span className={[
              'text-[9px] font-bold',
              isActive ? 'text-blue-700' : 'text-slate-400',
            ].join(' ')}>
              {label}
            </span>

            {/* Active indicator bar */}
            {isActive && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                style={{ background: 'linear-gradient(90deg, #1B4FD8, #F97316)' }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
