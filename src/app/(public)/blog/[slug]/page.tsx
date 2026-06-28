/**
 * =============================================================
 * Blog Detail Page — /blog/[slug]
 * =============================================================
 *
 * Halaman detail artikel dengan optimasi SEO:
 * - Dynamic metadata (title, description, OG, Twitter)
 * - JSON-LD Article structured data
 * - Canonical URL per artikel
 * - Robots directive
 */

import prisma from '@/lib/prisma';
import Image from 'next/image';
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

export const dynamic = 'force-dynamic';

/**
 * generateMetadata — Dynamic SEO Metadata per Artikel
 *
 * Menghasilkan meta tags yang unik untuk setiap artikel,
 * termasuk Open Graph article tags dan robots directive.
 */
export async function generateMetadata({ params }: BlogDetailProps): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { kategoris: true },
  });

  if (!post) {
    return { title: 'Blog Tidak Ditemukan - Blog Flavory' };
  }

  // Bersihkan HTML tags dari excerpt/content untuk meta description
  const cleanDescription = (post.excerpt || post.content.substring(0, 160))
    .replace(/<[^>]*>/g, '')
    .trim();
  const imageUrl = post.image
    ? (post.image.startsWith('http') ? post.image : `https://blog.flavory.id${post.image}`)
    : 'https://blog.flavory.id/public/logo.png';
  const articleUrl = `https://blog.flavory.id/blog/${params.slug}`;

  return {
    // Title menggunakan template dari parent layout: "%s | Blog Flavory.id"
    title: post.title,
    description: cleanDescription,

    // Robots: izinkan index dan follow untuk halaman artikel
    robots: {
      index: true,
      follow: true,
    },

    // Open Graph — dengan article-specific tags
    openGraph: {
      type: 'article',
      title: `${post.title} | Blog Flavory.id`,
      description: cleanDescription,
      url: articleUrl,
      siteName: 'Blog Flavory.id',
      locale: 'id_ID',
      // Article-specific OG tags
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      section: post.kategoris.length > 0 ? post.kategoris[0].nama : 'Umum',
      authors: ['Admin Blog Flavory.id'],
      images: [
        {
          url: imageUrl,
          alt: post.title,
          width: 1200,
          height: 630,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | Blog Flavory.id`,
      description: cleanDescription,
      images: [imageUrl],
    },

    // Canonical URL — mencegah duplikat konten
    alternates: {
      canonical: articleUrl,
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
  const displayViews = post.views + 1;

  const categoryIds = post.kategoris.map((kat) => kat.id);
  let recommendedPosts = await prisma.post.findMany({
    where: {
      slug: { not: params.slug },
      kategoris: {
        some: {
          id: { in: categoryIds },
        },
      },
    },
    include: {
      kategoris: true,
    },
    orderBy: [
      { views: 'desc' },
      { createdAt: 'desc' },
    ],
    take: 4,
  });

  if (recommendedPosts.length === 0) {
    recommendedPosts = await prisma.post.findMany({
      where: {
        slug: { not: params.slug },
      },
      include: {
        kategoris: true,
      },
      orderBy: [
        { views: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 4,
    });
  }

  // =============================================================
  // JSON-LD Article Structured Data
  // Membantu Google menampilkan rich snippet artikel di hasil pencarian
  // =============================================================
  const articleImageUrl = post.image
    ? (post.image.startsWith('http') ? post.image : `https://blog.flavory.id${post.image}`)
    : 'https://blog.flavory.id/public/logo.png';

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": (post.excerpt || post.content.substring(0, 160)).replace(/<[^>]*>/g, '').trim(),
    "image": articleImageUrl,
    "datePublished": post.createdAt.toISOString(),
    "dateModified": post.updatedAt.toISOString(),
    "author": {
      "@type": "Person",
      "name": "Admin",
      "url": "https://blog.flavory.id",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Blog Flavory.id",
      "logo": {
        "@type": "ImageObject",
        "url": "https://blog.flavory.id/public/logo.png",
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://blog.flavory.id/blog/${params.slug}`,
    },
    "articleSection": post.kategoris.length > 0 ? post.kategoris[0].nama : "Umum",
    "wordCount": post.content.replace(/<[^>]*>/g, '').split(/\s+/).length,
    "inLanguage": "id-ID",
  };

  // =============================================================
  // JSON-LD BreadcrumbList — Navigasi breadcrumb untuk Google
  // =============================================================
  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Beranda",
        "item": "https://blog.flavory.id",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://blog.flavory.id/blog",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://blog.flavory.id/blog/${params.slug}`,
      },
    ],
  };

  return (
    <article className="max-w-3xl mx-auto py-12 px-6">

      {/* === JSON-LD Structured Data untuk artikel ini === */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

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

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-500 font-medium border-b border-slate-200 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                <i className="fa-solid fa-user"></i>
              </div>
              <span>Penulis: <strong className="text-slate-800">Admin</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-regular fa-calendar text-orange-400"></i>
              {new Date(post.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-orange-700 font-semibold shadow-sm">
            <i className="fa-solid fa-eye"></i>
            {displayViews.toLocaleString()} views
          </div>
        </div>
      </header>

      <ShareButtons
        title={post.title}
        excerpt={post.excerpt || post.content.substring(0, 150)}
        slug={params.slug}
      />

      {/* Thumbnail Artikel — proporsional sesuai orientasi upload */}
      {post.image ? (
        <div className="w-full mb-10 flex justify-center rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 shadow-md">
          <Image
            src={post.image}
            alt={post.title}
            width={1200}
            height={900}
            className="w-full max-w-full h-auto max-h-[28rem] object-contain"
            unoptimized={true}
          />
        </div>
      ) : (
        <div className="w-full h-48 md:h-64 rounded-2xl bg-orange-50 flex items-center justify-center mb-10 border border-orange-100">
          <span className="text-5xl"></span>
        </div>
      )}

      {/* Isi Konten (Typography) dengan dangerouslySetInnerHTML */}
      <div
        className="prose prose-lg prose-slate max-w-none text-slate-800 prose-p:text-slate-800 prose-a:text-orange-500 hover:prose-a:text-orange-600 prose-headings:text-slate-900 mb-16"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {recommendedPosts.length > 0 && (
        <section className="mb-16">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-orange-500 font-bold mb-2">Rekomendasi</p>
              <h2 className="text-2xl font-bold text-slate-900">Blog populer di kategori ini</h2>
            </div>
            <p className="text-sm text-slate-500 max-w-xl">
              Ditampilkan berdasarkan jumlah tayangan terbanyak dari kategori yang sama.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {recommendedPosts.map((recommendation) => (
              <article key={recommendation.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:shadow-lg">
                <div className="mb-3 flex flex-wrap gap-2">
                  {recommendation.kategoris.map((kat) => (
                    <span key={kat.id} className="bg-white text-orange-600 text-[11px] font-bold uppercase px-3 py-1 rounded-full shadow-sm">
                      {kat.nama}
                    </span>
                  ))}
                </div>
                <Link href={`/blog/${recommendation.slug}`} className="group">
                  <h3 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-orange-500 mb-3 line-clamp-2">
                    {recommendation.title}
                  </h3>
                </Link>
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                  {recommendation.excerpt || recommendation.content.substring(0, 100) + '...'}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="inline-flex items-center gap-2">
                    <i className="fa-solid fa-eye"></i>
                    {recommendation.views.toLocaleString()} views
                  </span>
                  <span>
                    {new Date(recommendation.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* GARIS PEMBATAS */}
      <hr className="border-t-2 border-dashed border-slate-200 mb-8" />

      {/* COMPONENT FORM ULASAN PRIVAT */}
      <FormUlasanPrivat postId={post.id} />

    </article>
  );
}