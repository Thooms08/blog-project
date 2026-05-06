// app/dashboard/blog/edit/[slug]/page.tsx
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import CreateBlogClient from "../../create/CreateBlogClient"; 

export const dynamic = 'force-dynamic';

// Perhatikan: params-nya sekarang menangkap 'slug', bukan 'id'
export default async function EditBlogPage({ params }: { params: { slug: string } }) {
  const postSlug = params.slug;

  // Cari data postingan berdasarkan SLUG dari URL
  const post = await prisma.post.findUnique({
    where: { slug: postSlug },
    include: { kategoris: { select: { id: true } } } 
  });

  if (!post) {
    notFound();
  }

  const kategoris = await prisma.kategori.findMany({
    orderBy: { nama: 'asc' }
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* HEADER CYBERPUNK */}
      <div className="flex flex-col border-b-2 border-orange-500/20 pb-6 mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter italic">
          Update_<span className="text-orange-500">Post</span>
        </h1>
        <p className="text-slate-500 font-mono text-xs mt-2 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
          Terminal Modifikasi Data // {post.slug}
        </p>
      </div>

      <CreateBlogClient kategoris={kategoris} initialData={post} />
    </div>
  );
}