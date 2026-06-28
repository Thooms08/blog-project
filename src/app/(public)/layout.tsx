import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";

export const dynamic = 'force-dynamic';

// =============================================================
// METADATA SEO — Dioptimasi untuk Search Engine & Social Media
// =============================================================
export const metadata: Metadata = {
  // Base URL untuk resolve path relatif di meta tags
  metadataBase: new URL('https://blog.flavory.id'),

  // Title template: halaman child bisa override dengan formatnya sendiri
  title: {
    default: "Blog Flavory.id — Informasi Seputar Flavory, Teknologi & Manajemen Bisnis",
    template: "%s | Blog Flavory.id",
  },

  description: "Blog resmi Flavory.id — sumber informasi terpercaya seputar perkembangan Flavory.id, wawasan teknologi terkini, dan strategi manajemen bisnis untuk para profesional dan pengusaha Indonesia.",

  keywords: [
    "blog flavory", "flavory.id", "teknologi", "manajemen bisnis",
    "strategi bisnis", "informasi flavory", "bisnis indonesia",
    "tips manajemen", "inovasi teknologi", "blog indonesia",
  ],

  // Instruksi untuk search engine crawler
  robots: {
    index: true,    // Izinkan halaman di-index
    follow: true,   // Izinkan crawler mengikuti link
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,     // Izinkan preview video penuh
      'max-image-preview': 'large', // Izinkan preview gambar besar
      'max-snippet': -1,            // Izinkan snippet teks penuh
    },
  },

  // Favicon dan icon
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png', sizes: '32x32' },
      { url: '/logo.png', type: 'image/png', sizes: '16x16' },
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },

  // Canonical URL — mencegah duplikat konten di Google
  alternates: {
    canonical: 'https://blog.flavory.id',
  },

  openGraph: {
    type: 'website',
    locale: 'id_ID',
    title: 'Blog Flavory.id — Informasi Seputar Flavory, Teknologi & Manajemen Bisnis',
    description: 'Sumber informasi terpercaya seputar perkembangan Flavory.id, wawasan teknologi terkini, dan strategi manajemen bisnis.',
    siteName: 'Blog Flavory.id',
    url: 'https://blog.flavory.id',
    images: [
      {
        url: '/logo.png',
        alt: 'Blog Flavory.id — Informasi Seputar Flavory, Teknologi & Manajemen Bisnis',
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Blog Flavory.id — Informasi Seputar Flavory, Teknologi & Manajemen Bisnis',
    description: 'Sumber informasi terpercaya seputar perkembangan Flavory.id, teknologi, dan manajemen bisnis.',
    images: ['/logo.png'],
  },
};

// =============================================================
// JSON-LD STRUCTURED DATA
// =============================================================

/**
 * JSON-LD WebSite schema — membantu Google menampilkan sitelinks
 * dan memahami struktur website.
 */
const jsonLdWebsite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Blog Flavory.id",
  "alternateName": "Blog Flavory",
  "url": "https://blog.flavory.id",
  "description": "Blog resmi Flavory.id — informasi seputar Flavory.id, teknologi, dan manajemen bisnis.",
  "inLanguage": "id-ID",
  "publisher": {
    "@type": "Organization",
    "name": "Flavory.id",
    "url": "https://flavory.id",
    "logo": {
      "@type": "ImageObject",
      "url": "https://blog.flavory.id/logo.png",
    },
  },
};

/**
 * JSON-LD Organization schema — membantu Google menampilkan
 * knowledge panel brand di hasil pencarian.
 */
const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Flavory.id",
  "url": "https://flavory.id",
  "logo": "https://blog.flavory.id/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "adminku@flavory.id",
    "telephone": "+6285797574754",
    "contactType": "customer service",
    "areaServed": "ID",
    "availableLanguage": "Indonesian",
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Karawang",
    "addressRegion": "Jawa Barat",
    "addressCountry": "ID",
  },
};

// =============================================================
// LAYOUT COMPONENT
// =============================================================

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Ambil daftar kategori untuk navigasi dropdown
  const categories = await prisma.kategori.findMany({
    orderBy: { nama: "asc" },
  });

  return (
    <>
      {/* === JSON-LD Structured Data — untuk Google Rich Results === */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
      />

      {/* NAVBAR STICKY */}
      <Navbar categories={categories} />

      {/* Konten akan otomatis di-handle oleh loading.tsx saat proses render */}
      <main className="flex-grow w-full">
        {children}
      </main>

      {/* === FOOTER === */}
      <footer id="footer" className="w-full bg-white border-t border-slate-100 py-10 text-center mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h3 className="text-lg font-bold text-slate-700 mb-4">Kontak Kami</h3>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-6">
            <div className="flex items-center gap-2 text-slate-600">
              <i className="fa-solid fa-envelope"></i>
              <span>Email: <a href="mailto:adminku@flavory.id" className="text-orange-500 hover:underline">adminku@flavory.id</a></span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <i className="fa-brands fa-whatsapp"></i>
              <span>Whatsapp: <a href="https://wa.me/6285797574754" className="text-orange-500 hover:underline">085797574754</a></span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <i className="fa-solid fa-map-marker-alt"></i>
              <span>Alamat: Karawang, Jawa Barat, Indonesia</span>
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium flex items-center justify-center gap-2" suppressHydrationWarning>
            <i className="fa-regular fa-copyright"></i> {new Date().getFullYear()} Blog.Flavory.id — All Rights Reserved.
          </p>
        </div>
      </footer>
    </>
  );
}