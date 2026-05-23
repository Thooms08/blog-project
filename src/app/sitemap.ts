import { MetadataRoute } from 'next';
import { PrismaClient } from '@prisma/client';

// Inisialisasi Prisma Client
const prisma = new PrismaClient();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://blog.flavory.id';

  try {
    // Mengambil data slug dan tanggal update dari model Post
    const posts = await prisma.post.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    const postUrls = posts.map((post) => ({
      url: `${baseUrl}/blog/${encodeURIComponent(post.slug)}`,
      lastModified: post.updatedAt, 
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    // Menggabungkan URL statis (Beranda & Index Blog) dengan URL dinamis artikel
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      ...postUrls,
    ];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    
    // Fallback: Jika terjadi error pada database, tetap kembalikan sitemap URL utama
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
    ];
  } finally {
    // Menutup koneksi Prisma setelah selesai agar tidak terjadi kebocoran koneksi memori
    await prisma.$disconnect();
  }
}