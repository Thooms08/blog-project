import prisma from "@/lib/prisma";
import CreateBlogClient from "./CreateBlogClient";

export const dynamic = 'force-dynamic'; // Selalu ambil data terbaru

export default async function CreateBlogPage() {
  // Ambil semua daftar kategori dari database untuk dipilih
  const kategoris = await prisma.kategori.findMany({
    orderBy: { nama: 'asc' }
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* HEADER CYBERPUNK */}
      <div className="flex flex-col border-b-2 border-orange-500/20 pb-6 mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter italic">
          Create_<span className="text-orange-500">Post</span>
        </h1>
        <p className="text-slate-500 font-mono text-xs mt-2 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
          Terminal Input Data Blog
        </p>
      </div>

      {/* Panggil komponen Form dan kirim data kategori */}
      <CreateBlogClient kategoris={kategoris} />
    </div>
  );
}