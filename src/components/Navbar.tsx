'use client';

// ══════════════════════════════════════════════════════════════
// HAKIKU — Navbar Component
// src/components/Navbar.tsx
// ══════════════════════════════════════════════════════════════

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/',            label: 'Beranda'    },
  { href: '/diagnosis',   label: 'Diagnosis'  },
  { href: '/hasil',       label: 'Hasil'      },
  { href: '/konsultasi',  label: 'Konsultasi' },
  { href: '/dashboard',   label: 'Dashboard'  },
  { href: '/dokumen',     label: 'Dokumen'    },
  { href: '/edukasi',     label: 'Edukasi'    },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="h-14 bg-white border-b-2 border-slate-200 flex items-center justify-between px-4 flex-shrink-0 z-50"
         style={{ boxShadow: '0 2px 12px rgba(27,79,216,0.06)' }}>

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 flex-shrink-0">
        <Image
          src="/logo.png"
          alt="HAKIKU"
          width={120}
          height={42}
          className="object-contain h-9 w-auto"
          priority
        />
      </Link>

      {/* Desktop Nav Tabs */}
      <div className="flex gap-0.5 overflow-x-auto scroll-x-hidden">
        {NAV_ITEMS.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={[
                'px-2.5 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all duration-150',
                isActive
                  ? 'bg-blue-700 text-white'
                  : 'text-slate-500 hover:bg-blue-50 hover:text-blue-700',
              ].join(' ')}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
