import prisma from '@/lib/prisma';
import PostGrid from '@/components/PostGrid';

export const revalidate = 60; // ISR: Update tiap 60 detik

interface HomePageProps {
  searchParams: { kategori?: string };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  // 1. Tangkap query params untuk filter
  const filterKategori = searchParams.kategori;

  // 2. Fetch Postingan beserta relasi Kategorinya
  const rawPosts = await prisma.post.findMany({
    where: filterKategori ? {
      kategoris: {
        some: { nama: filterKategori } // Filter relasi Many-to-Many
      }
    } : {},
    include: {
      kategoris: true, // Ambil data kategori setiap post
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const posts = rawPosts.map((post) => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
    views: post.views ?? 0,
  }));

  return (
    <div className="w-full">
      {/* Header / Hero Section (Hanya tampil jika tidak sedang filter kategori) */}
      {!filterKategori && (
        <header className="bg-orange-500 text-white py-20 px-6 text-center shadow-inner">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Selamat Datang di Blog.Flavory.Id
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl mx-auto">
            Temukan berbagai cerita, ide, dan wawasan terbaru yang penuh rasa di sini.
          </p>
        </header>
      )}

      {/* Konten Utama - Grid Artikel */}
      <section className="max-w-7xl mx-auto py-12 px-6">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl font-bold text-slate-800 border-b-4 border-orange-500 inline-block pb-2">
            {filterKategori ? `Blog Kategori: ${filterKategori}` : "Blog Terbaru"}
          </h2>
        </div>

        {posts.length === 0 ? (
          <div className="text-center text-slate-500 py-16 bg-white rounded-2xl shadow-sm border border-slate-100">
            <span className="text-5xl mb-4 block">📭</span>
            <p className="text-lg font-medium">Belum ada artikel di kategori ini.</p>
          </div>
        ) : (
          <PostGrid posts={posts} />
        )}
      </section>
    </div>
  );
}