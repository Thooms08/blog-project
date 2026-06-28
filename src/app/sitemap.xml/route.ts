/**
 * =============================================================
 * sitemap.xml — Dynamic Sitemap Generator untuk Blog Flavory.id
 * =============================================================
 *
 * Sitemap yang dioptimasi SEO:
 * - Halaman utama dan blog listing
 * - Semua halaman artikel dengan lastmod
 * - Image sitemap extension (membantu Google Image Search)
 * - Halaman kategori sebagai URL terpisah
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const baseUrl = 'https://blog.flavory.id';

  try {
    // -------------------------------------------------------
    // 1. Ambil data artikel beserta gambar dan kategori
    // -------------------------------------------------------
    const posts = await prisma.post.findMany({
      select: {
        slug: true,
        title: true,
        image: true,
        updatedAt: true,
      },
    });

    // -------------------------------------------------------
    // 2. Ambil daftar kategori untuk halaman filter
    // -------------------------------------------------------
    const kategoris = await prisma.kategori.findMany({
      select: {
        nama: true,
        updated_at: true,
      },
    });

    // -------------------------------------------------------
    // 3. Susun XML untuk setiap artikel (dengan image extension)
    // -------------------------------------------------------
    const postUrlsXml = posts
      .map((post: { slug: string; title: string; image: string | null; updatedAt: Date }) => {
        // Bangun URL gambar absolut jika tersedia
        const image = post.image;
        const imageTag = image
          ? `\n    <image:image>\n      <image:loc>${
              image.startsWith('http') ? image : `${baseUrl}${image}`
            }</image:loc>\n      <image:title>${escapeXml(post.title)}</image:title>\n    </image:image>`
          : '';

        return `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.updatedAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>${imageTag}
  </url>`;
      })
      .join('');

    // -------------------------------------------------------
    // 4. Susun XML untuk setiap halaman kategori
    // -------------------------------------------------------
    const categoryUrlsXml = kategoris
      .map((kat: { nama: string; updated_at: Date }) => {
        return `
  <url>
    <loc>${baseUrl}/?kategori=${encodeURIComponent(kat.nama)}</loc>
    <lastmod>${new Date(kat.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`;
      })
      .join('');

    // -------------------------------------------------------
    // 5. Gabungkan semua menjadi struktur XML utuh
    //    Termasuk namespace image untuk Google Image Search
    // -------------------------------------------------------
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>${postUrlsXml}${categoryUrlsXml}
</urlset>`;

    // Kembalikan respons berupa file XML asli
    return new NextResponse(sitemapXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch {
    // Jika ada kendala tersembunyi, fallback tetap aman
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}</loc><priority>1.0</priority></url>
  <url><loc>${baseUrl}/blog</loc><priority>0.8</priority></url>
</urlset>`,
      {
        headers: { 'Content-Type': 'application/xml' },
      }
    );
  }
}

/**
 * Escape karakter khusus XML agar tidak merusak struktur sitemap.
 * Diperlukan untuk judul artikel yang mungkin mengandung &, <, >, dll.
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}