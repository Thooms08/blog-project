/**
 * =============================================================
 * /api/posts — Public API Endpoint untuk Blog Flavory.id
 * =============================================================
 *
 * Endpoint ini digunakan oleh website utama flavory.id (Laravel)
 * untuk menampilkan preview artikel blog terbaru.
 *
 * METHOD  : GET
 * URL     : /api/posts?limit=3
 * CORS    : Hanya mengizinkan origin https://flavory.id
 * CACHE   : Public, revalidate setiap 1 jam (3600 detik)
 *
 * RESPONSE:
 * [
 *   {
 *     "title": "string",
 *     "excerpt": "string (maks 150 karakter)",
 *     "slug": "string",
 *     "cover_image": "string (URL absolut)",
 *     "category": "string",
 *     "published_at": "string (format: DD MMM YYYY, bahasa Indonesia)",
 *     "url": "string (URL lengkap ke artikel)"
 *   }
 * ]
 */

import { NextRequest, NextResponse } from 'next/server';
import { getLatestPosts } from '@/lib/getPosts';

// =============================================================
// KONSTANTA KONFIGURASI
// =============================================================

/** Origin yang diizinkan mengakses API ini */
const ALLOWED_ORIGIN = 'https://flavory.id';

/** Batas minimum jumlah post yang bisa diminta */
const MIN_LIMIT = 1;

/** Batas maksimum jumlah post yang bisa diminta */
const MAX_LIMIT = 20;

/** Jumlah post default jika parameter limit tidak diberikan */
const DEFAULT_LIMIT = 3;

// =============================================================
// CORS HEADERS
// =============================================================

/**
 * Headers CORS yang ditambahkan ke setiap response.
 * Mengizinkan hanya domain https://flavory.id untuk mengakses API.
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400', // Cache preflight selama 24 jam
};

// =============================================================
// HANDLER: OPTIONS (Preflight Request)
// =============================================================

/**
 * Handler untuk preflight request (CORS).
 *
 * Browser akan mengirim request OPTIONS sebelum request GET
 * untuk memverifikasi bahwa server mengizinkan cross-origin access.
 * Response 204 (No Content) menandakan preflight sukses.
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// =============================================================
// HANDLER: GET /api/posts?limit=3
// =============================================================

/**
 * Handler utama untuk mengambil daftar post terbaru.
 *
 * Query Parameters:
 * - limit (opsional): Jumlah post yang dikembalikan (1-20, default: 3)
 *
 * Response Headers:
 * - CORS: Access-Control-Allow-Origin: https://flavory.id
 * - Cache: public, s-maxage=3600, stale-while-revalidate=60
 *
 * @param request - NextRequest object dari Next.js
 * @returns NextResponse berisi JSON array post
 */
export async function GET(request: NextRequest) {
  try {
    // -------------------------------------------------------
    // 1. Parsing dan validasi query parameter "limit"
    // -------------------------------------------------------
    const { searchParams } = request.nextUrl;
    const rawLimit = searchParams.get('limit');

    // Parse limit: gunakan default jika tidak diberikan atau tidak valid
    let limit = DEFAULT_LIMIT;

    if (rawLimit !== null) {
      const parsedLimit = parseInt(rawLimit, 10);

      // Validasi: harus angka valid, dalam range MIN_LIMIT - MAX_LIMIT
      if (!isNaN(parsedLimit)) {
        limit = Math.max(MIN_LIMIT, Math.min(MAX_LIMIT, parsedLimit));
      }
    }

    // -------------------------------------------------------
    // 2. Ambil data post dari database via helper
    // -------------------------------------------------------
    const posts = await getLatestPosts(limit);

    // -------------------------------------------------------
    // 3. Kirim response JSON dengan headers CORS dan Cache
    // -------------------------------------------------------
    return NextResponse.json(posts, {
      status: 200,
      headers: {
        ...corsHeaders,

        // Cache-Control:
        // - public: boleh di-cache oleh CDN dan browser
        // - s-maxage=3600: CDN cache selama 1 jam (3600 detik)
        // - stale-while-revalidate=60: tetap serve cache lama
        //   selama 60 detik sambil re-fetch data terbaru di background
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    // -------------------------------------------------------
    // ERROR HANDLING: Tangani error tak terduga
    // -------------------------------------------------------
    console.error('[API /api/posts] Error tak terduga:', error);

    return NextResponse.json(
      {
        error: 'Terjadi kesalahan server saat mengambil data post.',
        posts: [],
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
