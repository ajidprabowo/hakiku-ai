// ══════════════════════════════════════════════════════════════
// HAKIKU — Root Layout
// src/app/layout.tsx
// ══════════════════════════════════════════════════════════════

import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Montserrat } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HAKIKU — Solusi Pendaftaran HAKI yang Lebih Cerdas dan Pasti',
  description:
    'Platform konsultasi pengurusan HAKI berbasis AI yang mudah, terjangkau, dan pasti! ' +
    'Diagnosis kebutuhan HAKI, cek database PDKI, persiapan dokumen, dan konsultasi dengan AI.',
  keywords: ['HAKI', 'HKI', 'hak cipta', 'merek dagang', 'DJKI', 'UMKM', 'kreator'],
  authors: [{ name: 'HAKIKU Team' }],
  openGraph: {
    title: 'HAKIKU — Solusi HAKI untuk Kreator Indonesia',
    description: 'Platform konsultasi HAKI berbasis AI — mudah, terjangkau, dan pasti!',
    type: 'website',
  },
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${plusJakarta.variable} ${montserrat.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
