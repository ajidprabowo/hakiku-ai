// ══════════════════════════════════════════════════════════════
// HAKIKU — Data Modul Edukasi
// src/data/modules.ts
//
// Sumber: Modul.pdf — 14 modul, 5 section
// ══════════════════════════════════════════════════════════════

import type { EduModule } from '@/types';

export const EDU_MODULES: EduModule[] = [
  // ── Section 1: Fundamental ──────────────────────────────────
  {
    id: 1, sec: 'fundamental',
    icon: '📖', bg: '#EEF3FF',
    title: 'Pengenalan Kekayaan Intelektual (HAKI)',
    sub: 'Memahami HAKI dari sudut pandang pelaku usaha',
    dur: '8 mnt', prog: 100,
    tags: ['✅ Selesai', 'Artikel', 'Quiz'],
    done: true,
  },
  {
    id: 2, sec: 'fundamental',
    icon: '🗂️', bg: '#FFF0E0',
    title: 'Menentukan Jenis HAKI yang Tepat',
    sub: 'Panduan memilih perlindungan yang sesuai dengan karya kamu',
    dur: '10 mnt', prog: 100,
    tags: ['✅ Selesai', 'Studi Kasus'],
    done: true,
  },
  {
    id: 3, sec: 'fundamental',
    icon: '💎', bg: '#D1FAE5',
    title: 'Nilai Ekonomi dan Manfaat HAKI',
    sub: 'HAKI sebagai aset bisnis yang menghasilkan nilai jangka panjang',
    dur: '7 mnt', prog: 60,
    tags: ['60% Selesai', 'Artikel', 'Quiz'],
    done: false,
  },

  // ── Section 2: Persiapan ────────────────────────────────────
  {
    id: 4, sec: 'persiapan',
    icon: '🔍', bg: '#FFF7ED',
    title: 'Apa yang Bisa dan Tidak Bisa Dilindungi HAKI',
    sub: 'Batasan perlindungan HAKI yang wajib kamu ketahui sebelum daftar',
    dur: '9 mnt', prog: 0,
    tags: ['Belum Dimulai', 'Artikel'],
    done: false,
  },
  {
    id: 5, sec: 'persiapan',
    icon: '⚠️', bg: '#FEE2E2',
    title: 'Cek Kemiripan & Risiko Penolakan',
    sub: 'Cara mengecek database PDKI DJKI sebelum mendaftarkan HAKI',
    dur: '11 mnt', prog: 0,
    tags: ['Belum Dimulai', 'Panduan Praktis'],
    done: false,
  },
  {
    id: 6, sec: 'persiapan',
    icon: '📁', bg: '#F5F3FF',
    title: 'Persiapan Dokumen & Deskripsi Karya',
    sub: 'Checklist lengkap sebelum masuk ke proses formal DJKI',
    dur: '12 mnt', prog: 0,
    tags: ['Belum Dimulai', 'Checklist', 'Template'],
    done: false,
  },

  // ── Section 3: Proses Pendaftaran ───────────────────────────
  {
    id: 7, sec: 'proses',
    icon: '📋', bg: '#E6F7F4',
    title: 'Alur Lengkap Pendaftaran HAKI di DJKI',
    sub: '10 langkah panduan di portal resmi DJKI',
    dur: '15 mnt', prog: 0,
    tags: ['Belum Dimulai', 'Video', 'Panduan'],
    done: false,
  },
  {
    id: 8, sec: 'proses',
    icon: '🛡️', bg: '#FFF0E0',
    title: 'Tips Menghindari Penolakan HAKI',
    sub: 'Kesalahan umum yang sering terjadi dan cara menghindarinya',
    dur: '10 mnt', prog: 0,
    tags: ['Belum Dimulai', 'Tips Praktis'],
    done: false,
  },
  {
    id: 9, sec: 'proses',
    icon: '💰', bg: '#EEF3FF',
    title: 'Estimasi Biaya, Waktu & Timeline Proses',
    sub: 'Rincian lengkap biaya PNBP PP 45/2024 dan proyeksi waktu',
    dur: '8 mnt', prog: 0,
    tags: ['Belum Dimulai', 'Tabel Biaya'],
    done: false,
  },

  // ── Section 4: Risiko & Perlindungan ────────────────────────
  {
    id: 10, sec: 'risiko',
    icon: '🚨', bg: '#FEE2E2',
    title: 'Apa yang Dilakukan Jika Karya Ditiru?',
    sub: 'Langkah-langkah hukum saat terjadi pelanggaran HAKI',
    dur: '13 mnt', prog: 0,
    tags: ['Belum Dimulai', 'Studi Kasus Nyata'],
    done: false,
  },
  {
    id: 11, sec: 'risiko',
    icon: '🔒', bg: '#D1FAE5',
    title: 'Cara Menjaga & Mengelola HAKI Setelah Terdaftar',
    sub: 'Perpanjangan, monitoring, dan pengelolaan portofolio HAKI',
    dur: '9 mnt', prog: 0,
    tags: ['Belum Dimulai', 'Panduan'],
    done: false,
  },

  // ── Section 5: Bisnis & Monetisasi ──────────────────────────
  {
    id: 12, sec: 'bisnis',
    icon: '📈', bg: '#F5F3FF',
    title: 'HAKI sebagai Aset Bisnis yang Bernilai',
    sub: 'Mengubah HAKI dari sekadar proteksi menjadi sumber pendapatan',
    dur: '11 mnt', prog: 0,
    tags: ['Belum Dimulai', 'Artikel', 'Kasus'],
    done: false,
  },
  {
    id: 13, sec: 'bisnis',
    icon: '🤝', bg: '#FFFBEB',
    title: 'Monetisasi HAKI — Lisensi, Franchise & Royalti',
    sub: 'Cara menghasilkan pendapatan aktif dari aset intelektual kamu',
    dur: '14 mnt', prog: 0,
    tags: ['Belum Dimulai', 'Strategi Bisnis'],
    done: false,
  },
  {
    id: 14, sec: 'bisnis',
    icon: '🏆', bg: '#FFF0E0',
    title: 'Meningkatkan Nilai Brand dengan HAKI',
    sub: 'Strategi membangun brand yang kuat dan terlindungi secara hukum',
    dur: '12 mnt', prog: 0,
    tags: ['Belum Dimulai', 'Brand Strategy'],
    done: false,
  },
];

// Label untuk setiap section
export const SECTION_LABELS: Record<string, string> = {
  fundamental: 'Section 1 — Fundamental (Pemahaman Dasar)',
  persiapan:   'Section 2 — Persiapan Sebelum Pendaftaran',
  proses:      'Section 3 — Proses Pendaftaran HAKI',
  risiko:      'Section 4 — Risiko & Perlindungan',
  bisnis:      'Section 5 — Pemanfaatan HAKI untuk Bisnis',
};

// Warna label per section
export const SECTION_COLORS: Record<string, string> = {
  fundamental: '#1B4FD8',
  persiapan:   '#2563EB',
  proses:      '#0E7A65',
  risiko:      '#DC2626',
  bisnis:      '#7C3AED',
};
