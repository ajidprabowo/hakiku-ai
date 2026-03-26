// ══════════════════════════════════════════════════════════════
// HAKIKU — Utility Functions
// src/lib/utils.ts
// ══════════════════════════════════════════════════════════════

/**
 * Format angka ke format Rupiah Indonesia
 * Contoh: 200000 → "Rp 200.000"
 */
export function formatRupiah(amount: number): string {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

/**
 * Gabungkan class names (menggantikan clsx untuk kasus sederhana)
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Convert File ke base64 string (untuk pengiriman ke API)
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Ambil bagian base64 saja (hapus "data:...;base64,")
      resolve(result.split(',')[1]);
    };
    reader.onerror = () => reject(new Error('Gagal membaca file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Format ukuran file menjadi teks yang mudah dibaca
 * Contoh: 15000 → "14.6 KB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Truncate teks panjang dengan ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Delay (untuk efek animasi / loading)
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
