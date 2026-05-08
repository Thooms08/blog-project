import prisma from '@/lib/prisma';
import Link from 'next/link';

export const revalidate = 60; // ISR: Update tiap 60 detik

interface HomePageProps {
  searchParams: { kategori?: string };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  // 1. Tangkap query params untuk filter
  const filterKategori = searchParams.kategori;

  // 2. Fetch Postingan beserta relasi Kategorinya
  const posts = await prisma.post.findMany({
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article 
                key={post.id} 
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col group"
              >
                {/* Visual Thumbnail */}
                <Link href={`/blog/${post.slug}`} className="block h-56 bg-orange-50 w-full overflow-hidden relative">
                  {post.image ? (
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-orange-300">
                      <span className="text-5xl">🍊</span>
                    </div>
                  )}
                  {/* Kategori Badge Overlay */}
                  <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                    {post.kategoris.map(kat => (
                      <span key={kat.id} className="bg-white/90 backdrop-blur-sm text-orange-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                        {kat.nama}
                      </span>
                    ))}
                  </div>
                </Link>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold text-slate-400">
                      {new Date(post.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </span>
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                      <i className="fa-solid fa-user text-orange-400"></i> Admin
                    </span>
                  </div>
                  
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-orange-500 transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  
                  <p className="text-slate-600 mb-6 line-clamp-3 text-sm flex-grow">
                    {post.excerpt || post.content.substring(0, 120) + '...'}
                  </p>
                  
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="inline-block w-full text-center bg-orange-50 hover:bg-orange-500 hover:text-white text-orange-600 font-semibold py-2.5 px-4 rounded-xl transition-colors duration-200"
                  >
                    Baca Selengkapnya
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}