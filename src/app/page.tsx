import prisma from '@/lib/prisma';
import Link from 'next/link';

// Memaksa Next.js untuk memperbarui halaman setiap 60 detik (ISR)
export const revalidate = 60; 

export default async function HomePage() {
  // 1. Mengambil data langsung dari database flavory_blog
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: 'desc', // Urutkan dari yang paling baru
    },
  });

  return (
    <main className="min-h-screen bg-slate-50">
      
      {/* 🌟 Navigation Bar (Navbar) Baru 🌟 */}
      <nav className="w-full bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        {/* Logo/Nama Blog di Kiri */}
        <Link href="/" className="text-2xl font-extrabold text-orange-500 tracking-tight hover:opacity-80 transition-opacity">
          Flavory.
        </Link>
        
        {/* Tombol Auth di Kanan */}
        <div className="flex items-center gap-2 md:gap-4">
          <Link 
            href="/login"
            className="px-5 py-2.5 text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-colors text-sm md:text-base"
          >
            Masuk
          </Link>
          <Link 
            href="/register"
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all shadow-md shadow-orange-200 text-sm md:text-base"
          >
            Daftar
          </Link>
        </div>
      </nav>

      {/* Header / Hero Section */}
      <header className="bg-orange-500 text-white py-20 px-6 text-center shadow-md">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">
          Flavory Blog
        </h1>
        <p className="text-lg text-orange-100 max-w-2xl mx-auto">
          Eksplorasi cerita, ide, dan wawasan terbaru yang penuh rasa.
        </p>
      </header>

      {/* Konten Utama - Grid Artikel */}
      <section className="max-w-6xl mx-auto py-12 px-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-8 border-b-4 border-orange-500 inline-block pb-2">
          Artikel Terbaru
        </h2>

        {posts.length === 0 ? (
          <div className="text-center text-slate-500 py-10 bg-white rounded-xl shadow-sm border border-slate-100">
            <p>Belum ada artikel. Yuk tambahkan artikel pertamamu!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article 
                key={post.id} 
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col group"
              >
                {/* Visual Thumbnail */}
                <div className="h-48 bg-orange-100 w-full overflow-hidden relative">
                  {post.image ? (
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-orange-300">
                      <span className="text-4xl">🍊</span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-xs font-semibold text-orange-500 mb-2 uppercase tracking-wider">
                    {new Date(post.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 hover:text-orange-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 mb-6 line-clamp-3 text-sm flex-grow">
                    {post.excerpt || post.content.substring(0, 120) + '...'}
                  </p>
                  
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="inline-block w-full text-center bg-orange-50 hover:bg-orange-500 hover:text-white text-orange-600 font-semibold py-3 px-4 rounded-xl transition-colors duration-200"
                  >
                    Baca Selengkapnya
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}