// ══════════════════════════════════════════════════════════════
// HAKIKU — Data Konsultan KI Berlisensi
// src/data/consultants.ts
// ══════════════════════════════════════════════════════════════

import type { Consultant } from '@/types';

export const CONSULTANTS: Consultant[] = [
  {
    initials: 'DR',
    gradient: 'linear-gradient(135deg, #1B4FD8, #6366F1)',
    name: 'Dr. Rina Suharto, S.H., M.H.',
    credential: 'Konsultan KI Berlisensi DJKI · No. KKI-2021-0042',
    specialization: 'Spesialis: Hak Cipta & Merek · 12 tahun pengalaman · Jakarta',
    stars: '★★★★★',
    rating: '4.9 · 238 klien',
    availability: 'online',
    availabilityText: '🟢 Online',
  },
  {
    initials: 'AB',
    gradient: 'linear-gradient(135deg, #059669, #34D399)',
    name: 'Ahmad Baihaqi, S.H.',
    credential: 'Konsultan KI Berlisensi DJKI · No. KKI-2018-0117',
    specialization: 'Spesialis: Desain Industri & Paten · 8 tahun · Bandung',
    stars: '★★★★☆',
    rating: '4.7 · 156 klien',
    availability: 'busy',
    availabilityText: '🟡 Sibuk ±1 jam',
  },
  {
    initials: 'PW',
    gradient: 'linear-gradient(135deg, #D97706, #F59E0B)',
    name: 'Putri Wahyuni, S.H., M.Kn.',
    credential: 'Konsultan KI Berlisensi DJKI · No. KKI-2020-0089',
    specialization: 'Spesialis: Indikasi Geografis & EBT · 6 tahun · Yogyakarta',
    stars: '★★★★★',
    rating: '4.8 · 92 klien',
    availability: 'online',
    availabilityText: '🟢 Online',
  },
];

// Pricing konsultasi
export const CONSULTATION_PRICING = {
  chat:   { label: 'Chat',       price: 'Gratis',      free: true  },
  video:  { label: 'Video Call', price: 'Rp 49.000',   free: false },
  review: { label: 'Review Dokumen', price: 'Rp 79.000',   free: false },
};
