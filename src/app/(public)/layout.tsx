import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://blog.flavory.id'),
  title: "Blog Flavory.id - Eksplorasi Rasa dalam Tulisan",
  description: "Temukan wawasan terbaru tentang kuliner dan gaya hidup.",
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png', sizes: '32x32' },
      { url: '/logo.png', type: 'image/png', sizes: '16x16' },
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    type: 'website',
    title: 'Blog Flavory.id',
    description: 'Temukan wawasan terbaru tentang kuliner dan gaya hidup.',
    siteName: 'Blog Flavory.id',
    url: 'https://blog.flavory.id',
    images: [
      {
        url: '/logo.png',
        alt: 'Blog Flavory.id',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Flavory.id',
    description: 'Temukan wawasan terbaru tentang kuliner dan gaya hidup.',
    images: ['/logo.png'],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await prisma.kategori.findMany({
    orderBy: { nama: "asc" },
  });

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" />
        <link rel="shortcut icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#f97316" />
      </head>
      {/* overflow-x-hidden untuk mencegah munculnya jarak kosong di sisi kanan layar */}
      <body className={`${geistSans.variable} antialiased bg-slate-50 min-h-screen flex flex-col overflow-x-hidden`}>

        {/* NAVBAR STICKY */}
        <Navbar categories={categories} />

        {/* Konten akan otomatis di-handle oleh loading.tsx saat proses render */}
        <main className="flex-grow w-full">
          {children}
        </main>

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
            <p className="text-slate-500 text-sm font-medium flex items-center justify-center gap-2">
              <i className="fa-regular fa-copyright"></i> {new Date().getFullYear()} Blog.Flavory.id — All Rights Reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}