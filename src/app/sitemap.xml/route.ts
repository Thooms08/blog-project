import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const baseUrl = 'https://blog.flavory.id';

  try {
    // Ambil data artikel langsung dari database
    const posts = await prisma.post.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    // Susun baris URL blog secara dinamis
    const postUrlsXml = posts
      .map((post) => {
        return `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.updatedAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
      })
      .join('');

    // Gabungkan menjadi struktur XML utuh
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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
  </url>${postUrlsXml}
</urlset>`;

    // Kembalikan respons berupa file XML asli, bukan HTML/JSON
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