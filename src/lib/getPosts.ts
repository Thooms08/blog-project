/**
 * =============================================================
 * getPosts.ts — Helper Reusable untuk Mengambil Post Terbaru
 * =============================================================
 *
 * Fungsi ini digunakan oleh API endpoint /api/posts dan bisa
 * dipakai ulang di mana saja yang membutuhkan data post terbaru.
 *
 * Data diambil dari database MySQL via Prisma ORM, lalu
 * ditransformasi ke format JSON yang konsisten untuk konsumsi
 * pihak eksternal (misal: website utama flavory.id / Laravel).
 */

import prisma from '@/lib/prisma';

// =============================================================
// TYPE DEFINITIONS
// =============================================================

/** Format response JSON untuk setiap artikel */
export interface PublicPost {
  title: string;
  excerpt: string;
  slug: string;
  cover_image: string;
  category: string;
  published_at: string;
  url: string;
}

// =============================================================
// KONSTANTA
// =============================================================

/** Base URL produksi blog */
const BASE_URL = 'https://blog.flavory.id';

/** Panjang maksimal excerpt */
const EXCERPT_MAX_LENGTH = 150;

/** Placeholder gambar default jika post tidak memiliki cover image */
const DEFAULT_COVER_IMAGE = `${BASE_URL}/logo.png`;

/**
 * Daftar nama bulan dalam Bahasa Indonesia (disingkat 3 huruf).
 * Digunakan untuk format tanggal "DD MMM YYYY".
 */
const BULAN_INDONESIA: Record<number, string> = {
  0: 'Jan',
  1: 'Feb',
  2: 'Mar',
  3: 'Apr',
  4: 'Mei',
  5: 'Jun',
  6: 'Jul',
  7: 'Agu',
  8: 'Sep',
  9: 'Okt',
  10: 'Nov',
  11: 'Des',
};

// =============================================================
// HELPER FUNCTIONS
// =============================================================

/**
 * Format tanggal ke format "DD MMM YYYY" dalam Bahasa Indonesia.
 *
 * Contoh output: "25 Jun 2026"
 *
 * @param date - Objek Date yang akan diformat
 * @returns String tanggal dalam format Indonesia
 */
function formatTanggalIndonesia(date: Date): string {
  const hari = date.getDate();
  const bulan = BULAN_INDONESIA[date.getMonth()];
  const tahun = date.getFullYear();
  return `${hari} ${bulan} ${tahun}`;
}

/**
 * Potong teks excerpt agar tidak melebihi batas maksimal karakter.
 * Jika teks lebih panjang, akan dipotong di batas kata terdekat
 * dan ditambahkan "..." di akhir.
 *
 * @param text - Teks asli yang akan dipotong
 * @param maxLength - Batas maksimal karakter (default: 150)
 * @returns Teks yang sudah dipotong
 */
function truncateExcerpt(text: string, maxLength: number = EXCERPT_MAX_LENGTH): string {
  // Bersihkan HTML tags jika ada di content
  const cleanText = text.replace(/<[^>]*>/g, '').trim();

  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  // Potong di batas kata terdekat agar tidak terpotong di tengah kata
  const truncated = cleanText.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');

  // Jika ada spasi, potong di situ; jika tidak, potong langsung
  const result = lastSpaceIndex > 0 ? truncated.substring(0, lastSpaceIndex) : truncated;
  return `${result}...`;
}

/**
 * Konversi path gambar relatif dari database menjadi URL absolut.
 *
 * Contoh: "/assets/post/gambar.jpg" → "https://blog.flavory.id/assets/post/gambar.jpg"
 *
 * @param imagePath - Path relatif gambar dari database (bisa null)
 * @returns URL absolut gambar
 */
function buildCoverImageUrl(imagePath: string | null): string {
  if (!imagePath) {
    return DEFAULT_COVER_IMAGE;
  }

  // Jika sudah berupa URL absolut (https://...), kembalikan langsung
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Gabungkan base URL dengan path relatif
  return `${BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
}

// =============================================================
// FUNGSI UTAMA — EXPORTED
// =============================================================

/**
 * Mengambil daftar post terbaru dari database.
 *
 * Fitur:
 * - Query database dengan Prisma (include relasi kategori)
 * - Sort berdasarkan tanggal terbaru (createdAt descending)
 * - Limit hasil sesuai parameter
 * - Transform ke format PublicPost yang siap dikonsumsi API
 * - Error handling jika database tidak bisa diakses
 *
 * @param limit - Jumlah post yang diambil (default: 3, max: 20)
 * @returns Array of PublicPost yang sudah ditransformasi
 *
 * @example
 * ```ts
 * const posts = await getLatestPosts(3);
 * // Returns: [{ title, excerpt, slug, cover_image, category, published_at, url }]
 * ```
 */
export async function getLatestPosts(limit: number = 3): Promise<PublicPost[]> {
  try {
    // -------------------------------------------------------
    // 1. Query database: ambil post terbaru beserta kategorinya
    // -------------------------------------------------------
    const posts = await prisma.post.findMany({
      select: {
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        image: true,
        createdAt: true,
        kategoris: {
          select: {
            nama: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // Urutkan dari yang terbaru
      },
      take: limit, // Batasi jumlah hasil
    });

    // -------------------------------------------------------
    // 2. Transform setiap post ke format PublicPost
    // -------------------------------------------------------
    const transformedPosts: PublicPost[] = posts.map((post) => ({
      // Judul artikel
      title: post.title,

      // Excerpt: prioritaskan field excerpt, fallback ke content
      excerpt: post.excerpt
        ? truncateExcerpt(post.excerpt)
        : truncateExcerpt(post.content),

      // Slug untuk identifikasi artikel
      slug: post.slug,

      // URL absolut cover image
      cover_image: buildCoverImageUrl(post.image),

      // Kategori pertama, atau "Umum" jika tidak ada
      category: post.kategoris.length > 0
        ? post.kategoris[0].nama
        : 'Umum',

      // Tanggal publish dalam format Indonesia
      published_at: formatTanggalIndonesia(new Date(post.createdAt)),

      // URL lengkap ke halaman artikel
      url: `${BASE_URL}/blog/${post.slug}`,
    }));

    return transformedPosts;
  } catch (error) {
    // Log error untuk debugging di server
    console.error('[getPosts] Gagal mengambil data post dari database:', error);

    // Return array kosong agar API tetap merespons valid JSON
    return [];
  }
}
