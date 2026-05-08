// app/dashboard/blog/page.tsx
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function BlogListPage() {
  // Ambil semua data blog dari database
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-orange-500/20 pb-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
            Blog_<span className="text-orange-500">Archive</span>
          </h1>
          <p className="text-slate-500 font-mono text-xs mt-2 uppercase tracking-widest">
            Total Postingan Terdeteksi: {posts.length} UNIT
          </p>
        </div>
        
        {/* TOMBOL KE HALAMAN CREATE */}
        <Link 
          href="/dashboard/blog/create" 
          className="bg-orange-600 hover:bg-orange-500 text-white font-black py-3 px-6 rounded-lg uppercase text-xs tracking-widest transition-all shadow-[0_0_15px_rgba(234,88,12,0.3)] hover:-translate-y-1 active:translate-y-0 flex items-center gap-2"
        >
          <i className="fas fa-plus-circle"></i> Buat Postingan Baru
        </Link>
      </div>

      {/* TABEL DAFTAR BLOG (Biar Rapi di Dashboard) */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/50">
              <th className="p-4 text-[10px] font-bold text-orange-500 uppercase tracking-widest">Judul_Post</th>
              <th className="p-4 text-[10px] font-bold text-orange-500 uppercase tracking-widest hidden md:table-cell">Views</th>
              <th className="p-4 text-[10px] font-bold text-orange-500 uppercase tracking-widest hidden lg:table-cell">Tanggal_Input</th>
              <th className="p-4 text-[10px] font-bold text-orange-500 uppercase tracking-widest text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-10 text-center text-slate-600 font-mono italic">DATA_VOID: BELUM ADA POSTINGAN</td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-800/50 transition-colors group">
                  <td className="p-4">
                    <p className="font-bold text-slate-200 group-hover:text-orange-400 transition-colors">{post.title}</p>
                    <p className="text-[10px] text-slate-500 font-mono">slug: {post.slug}</p>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="bg-slate-950 px-2 py-1 rounded border border-orange-500/20 text-orange-500 text-xs font-mono">
                      {post.views}
                    </span>
                  </td>
                  <td className="p-4 hidden lg:table-cell text-xs text-slate-500 font-mono">
                    {new Date(post.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {/* Ini tombol Edit yang mengarahkan user ke halaman Edit spesifik sesuai ID-nya */}
                    <Link href={`/dashboard/blog/edit/${post.slug}`} className="text-slate-400 hover:text-orange-500 transition-colors">
                      <i className="fas fa-edit"></i>
                    </Link>
                    
                    <button className="text-slate-400 hover:text-red-500 transition-colors">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}