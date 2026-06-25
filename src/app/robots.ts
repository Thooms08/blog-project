/**
 * =============================================================
 * robots.ts — Generator Robots.txt untuk Blog Flavory.id
 * =============================================================
 *
 * File ini menggunakan Next.js Metadata API untuk generate
 * robots.txt secara otomatis. Ini memberi tahu search engine
 * crawler halaman mana yang boleh dan tidak boleh di-crawl.
 *
 * Output URL: https://blog.flavory.id/robots.txt
 */

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://blog.flavory.id';

  return {
    rules: [
      {
        // -------------------------------------------------------
        // Rule 1: Izinkan semua crawler mengakses halaman publik
        // -------------------------------------------------------
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',      // Halaman admin/dashboard — jangan di-index
          '/api/auth/',       // Endpoint autentikasi — sensitif
          '/api/dashboard/',  // API dashboard internal — tidak untuk publik
        ],
      },
    ],

    // -------------------------------------------------------
    // Referensikan sitemap agar crawler tahu di mana mencari
    // daftar lengkap halaman yang perlu di-crawl
    // -------------------------------------------------------
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
