import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import FormUlasanPrivat from './ulasan'; // Import komponen ulasan
import { incrementViews } from '@/lib/actions/blog.actions';
import ShareButtons from '@/components/ShareButtons';

interface BlogDetailProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogDetailProps): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  });

  if (!post) {
    return { title: 'Artikel Tidak Ditemukan - Blog Flavory' };
  }

  const postDescription = post.excerpt || post.content.substring(0, 150);
  const imageUrl = post.image ? post.image : 'https://blog.flavory.id/logo.png';

  return {
    title: `${post.title} | Blog Flavory.id`,
    description: postDescription,
    openGraph: {
      type: 'article',
      title: `${post.title} | Blog Flavory.id`,
      description: postDescription,
      url: `https://blog.flavory.id/blog/${params.slug}`,
      siteName: 'Blog Flavory.id',
      images: [
        {
          url: imageUrl,
          alt: post.title,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | Blog Flavory.id`,
      description: postDescription,
      images: [imageUrl],
    },
    alternates: {
      canonical: `https://blog.flavory.id/blog/${params.slug}`,
    },
  };
}

export default async function BlogDetail({ params }: BlogDetailProps) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: {
      kategoris: true,
    },
  });

  if (!post) {
    notFound();
  }

  // Increment views ketika user membaca artikel
  await incrementViews(params.slug);

  return (
    <article className="max-w-3xl mx-auto py-12 px-6">

      {/* Tombol Kembali */}
      <Link href="/" className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium mb-8 transition-colors">
        <i className="fa-solid fa-arrow-left"></i> Kembali ke Beranda
      </Link>

      {/* Header Artikel */}
      <header className="mb-8 text-center md:text-left">
        <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
          {post.kategoris.map((kat) => (
            <Link key={kat.id} href={`/?kategori=${kat.nama}`}>
              <span className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full hover:bg-orange-200 transition-colors cursor-pointer">
                {kat.nama}
              </span>
            </Link>
          ))}
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-slate-500 font-medium border-b border-slate-200 pb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
              <i className="fa-solid fa-user"></i>
            </div>
            <span>Penulis: <strong className="text-slate-800">Admin</strong></span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-2">
            <i className="fa-regular fa-calendar text-orange-400"></i>
            {new Date(post.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric', month: 'long', year: 'numeric'
            })}
          </div>
        </div>
      </header>

      <ShareButtons
        title={post.title}
        excerpt={post.excerpt || post.content.substring(0, 150)}
        slug={params.slug}
      />

      {/* Thumbnail Artikel (Diperbaiki agar Proporsional & Responsif) */}
      {post.image ? (
        <div className="w-full mb-10">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-auto max-h-[400px] object-cover rounded-2xl shadow-md border border-slate-100"
          />
        </div>
      ) : (
        <div className="w-full h-48 md:h-64 rounded-2xl bg-orange-50 flex items-center justify-center mb-10 border border-orange-100">
          <span className="text-5xl">🍊</span>
        </div>
      )}

      {/* Isi Konten (Typography) dengan dangerouslySetInnerHTML */}
      <div
        className="prose prose-lg prose-slate max-w-none text-slate-800 prose-p:text-slate-800 prose-a:text-orange-500 hover:prose-a:text-orange-600 prose-headings:text-slate-900 mb-16"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* GARIS PEMBATAS */}
      <hr className="border-t-2 border-dashed border-slate-200 mb-8" />

      {/* COMPONENT FORM ULASAN PRIVAT */}
      <FormUlasanPrivat postId={post.id} />

    </article>
  );
}