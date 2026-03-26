// ══════════════════════════════════════════════════════════════
// HAKIKU — TypeScript Types
// src/types/index.ts
// ══════════════════════════════════════════════════════════════

// ── Navigasi ──────────────────────────────────────────────────
export type Screen =
  | 'landing'
  | 'diagnosis'
  | 'hasil'
  | 'konsultasi'
  | 'dashboard'
  | 'dokumen'
  | 'edukasi';

export type KonsultasiTab = 'chat' | 'human' | 'review';

export type PriceMode = 'umkm' | 'umum';

export type EduFilter =
  | 'semua'
  | 'fundamental'
  | 'persiapan'
  | 'proses'
  | 'risiko'
  | 'bisnis';

// ── Chat AI ───────────────────────────────────────────────────
export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  timestamp?: Date;
}

export interface ChatRequest {
  message: string;
  history?: { role: 'user' | 'model'; text: string }[];
}

export interface ChatResponse {
  reply: string;
  error?: string;
}

// ── Review Dokumen ────────────────────────────────────────────
export interface ReviewRequest {
  fileBase64: string;
  mimeType: string;
  docType: string;
}

export interface ReviewResponse {
  result: string;
  error?: string;
}

// ── Diagnosis & Hasil ─────────────────────────────────────────
export interface DiagnosisResult {
  category: string;         // 'Kriya & Kerajinan' | 'Desain Grafis & Visual'
  purpose: string;          // tujuan pendaftaran
  lolosPct: number;         // estimasi % peluang lolos (0-100)
  hasConflict: boolean;     // ada merek yang konflik di DB
  matchCount: number;       // jumlah merek mirip di DB
  searchQuery?: string;     // kata kunci yang dicari
}

// ── HKI Database ─────────────────────────────────────────────
export interface HKIRecord {
  no: string;
  nama: string;
  tipe: string;
  status: string;
  nomor: string;
  kelas: string;
  deskripsi: string;
  pemilik: string;
}

// ── Dokumen Upload ────────────────────────────────────────────
export interface DocumentItem {
  id: number;
  title: string;
  hint: string;
  required: boolean;
  file: File | null;
}

// ── Modul Edukasi ─────────────────────────────────────────────
export interface EduModule {
  id: number;
  sec: EduFilter;
  icon: string;
  bg: string;
  title: string;
  sub: string;
  dur: string;
  prog: number;           // 0-100
  tags: string[];
  done: boolean;
}

// ── Konsultan ─────────────────────────────────────────────────
export interface Consultant {
  initials: string;
  gradient: string;
  name: string;
  credential: string;
  specialization: string;
  stars: string;
  rating: string;
  availability: 'online' | 'busy';
  availabilityText: string;
}

// ── Pricing ───────────────────────────────────────────────────
export interface PricingTier {
  HC: number;   // Hak Cipta
  DI: number;   // Desain Industri
  MK: number;   // Merek
  MT: number;   // Materai
}

export interface Pricing {
  umkm: PricingTier;
  umum: PricingTier;
}

// ── Checklist Calculator ──────────────────────────────────────
export interface CostChecks {
  HC: boolean;
  DI: boolean;
  MK: boolean;
  MT: boolean;
}
