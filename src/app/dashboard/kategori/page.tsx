import prisma from "@/lib/prisma";
import KategoriClient from "./KategoriClient";

export const dynamic = 'force-dynamic';

export default async function KategoriPage() {
  // Ambil data kategori sekaligus HITUNG jumlah postingan di dalamnya
  const kategoris = await prisma.kategori.findMany({
    include: {
      _count: {
        select: { posts: true }
      }
    },
    orderBy: { created_at: 'desc' }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* HEADER CYBERPUNK */}
      <div className="flex flex-col border-b-2 border-orange-500/20 pb-6">
        <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter italic">
          Kategori_<span className="text-orange-500">Management</span>
        </h1>
        <p className="text-slate-500 font-mono text-xs mt-2 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
          Master Data Kategori
        </p>
      </div>

      <KategoriClient kategoris={kategoris} />
    </div>
  );
}