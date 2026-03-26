// ══════════════════════════════════════════════════════════════
// HAKIKU — Data Biaya HAKI
// src/data/pricing.ts
//
// Sumber: PP No. 45 Tahun 2024 tentang PNBP Kemenkumham RI
// Berlaku: Maret 2024 — sekarang
// ══════════════════════════════════════════════════════════════

import type { Pricing } from '@/types';

// Biaya pendaftaran PNBP resmi
export const HAKI_PRICING: Pricing = {
  umkm: {
    HC: 200_000,   // Hak Cipta
    DI: 250_000,   // Desain Industri
    MK: 500_000,   // Merek (per kelas)
    MT: 10_000,    // Materai
  },
  umum: {
    HC: 400_000,
    DI: 800_000,
    MK: 1_800_000,
    MT: 10_000,
  },
};

// Keterangan per jenis HAKI
export const HAKI_DETAILS = {
  HC: {
    nama:    'Hak Cipta',
    waktu:   '9–14 hari kerja',
    berlaku: 'Seumur hidup + 70 tahun (perorangan)',
    portal:  'e-hakcipta.dgip.go.id',
    tips:    'Paling cepat! Cocok untuk karya seni, desain, motif, konten digital.',
  },
  DI: {
    nama:    'Desain Industri',
    waktu:   '6–12 bulan',
    berlaku: '10 tahun + dapat diperpanjang 1x',
    portal:  'dgip.go.id',
    tips:    '⚠️ Syarat: belum dipublikasi lebih dari 6 bulan sebelum daftar!',
  },
  MK: {
    nama:    'Merek Dagang',
    waktu:   '8–12 bulan',
    berlaku: '10 tahun + dapat diperpanjang',
    portal:  'merek.dgip.go.id',
    tips:    '⚠️ Sistem first-to-file — siapa duluan mendaftar, dia yang menang!',
  },
};

// Skenario paket lengkap
export const PACKAGE_SCENARIOS = [
  { label: 'Hak Cipta saja',             umkm: 210_000,   umum: 410_000 },
  { label: 'Hak Cipta + Merek (1 kelas)',umkm: 710_000,   umum: 2_210_000 },
  { label: 'Hak Cipta + Desain Industri',umkm: 460_000,   umum: 1_210_000 },
  { label: 'Paket Lengkap (3 jenis)',     umkm: 960_000,   umum: 3_010_000 },
];

// Format angka ke Rupiah
export function formatRupiah(amount: number): string {
  return 'Rp ' + amount.toLocaleString('id-ID');
}
