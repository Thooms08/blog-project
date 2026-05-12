import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import prisma from "@/lib/prisma";
import Link from "next/link";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Blog Flavory.id - Eksplorasi Rasa dalam Tulisan",
  description: "Temukan wawasan terbaru tentang kuliner dan gaya hidup.",
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
      {/* overflow-x-hidden untuk mencegah munculnya jarak kosong di sisi kanan layar */}
      <body className={`${geistSans.variable} antialiased bg-slate-50 min-h-screen flex flex-col overflow-x-hidden`}>

        {/* NAVBAR STICKY */}
        <nav className="w-full bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-[100] border-b border-orange-100">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center">

            {/* Logo */}
            <Link href="/" className="text-2xl font-black text-orange-500 tracking-tighter hover:scale-105 transition-transform mb-4 md:mb-0">
              Blog.Flavory.id
            </Link>

            {/* Menu Navigasi Utama */}
            <div className="flex flex-wrap items-center justify-center gap-5 md:gap-8">

              <Link href="/" className="text-sm font-bold text-slate-600 hover:text-orange-500 transition-colors flex items-center gap-2">
                <i className="fa-solid fa-house"></i> Beranda
              </Link>

              <Link href="/kontak" className="text-sm font-bold text-slate-600 hover:text-orange-500 transition-colors flex items-center gap-2">
                <i className="fa-solid fa-envelope"></i> Kontak
              </Link>

              {/* Dropdown Kategori menggunakan Group Hover Tailwind */}
              <div className="relative group">
                <button className="text-sm font-bold text-slate-600 hover:text-orange-500 transition-colors flex items-center gap-2 py-2 cursor-pointer">
                  <i className="fa-solid fa-tags"></i> Kategori <i className="fa-solid fa-chevron-down text-[10px] pt-0.5"></i>
                </button>

                {/* Panel Isi Dropdown */}
                {/* PERBAIKAN: md:left-0 dihapus, full menggunakan right-0 agar memanjang ke kiri layar */}
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-100 shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 overflow-hidden origin-top-right">
                  <div className="py-2 flex flex-col">
                    <Link
                      href="/"
                      className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-orange-50 hover:text-orange-500 transition-colors flex items-center gap-3"
                    >
                      <i className="fa-solid fa-border-all text-orange-400 w-4 text-center"></i> Semua Kategori
                    </Link>

                    {categories.map((kat) => (
                      <Link
                        key={kat.id}
                        href={`/?kategori=${encodeURIComponent(kat.nama)}`}
                        className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-orange-50 hover:text-orange-500 transition-colors flex items-center gap-3"
                      >
                        <i className="fa-solid fa-hashtag text-slate-300 w-4 text-center group-hover:text-orange-300"></i> {kat.nama}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </nav>

        {/* Konten akan otomatis di-handle oleh loading.tsx saat proses render */}
        <main className="flex-grow w-full">
          {children}
        </main>

        <footer className="w-full bg-white border-t border-slate-100 py-10 text-center mt-20">
          <p className="text-slate-500 text-sm font-medium flex items-center justify-center gap-2">
            <i className="fa-regular fa-copyright"></i> {new Date().getFullYear()} Blog.Flavory.id — All Rights Reserved
          </p>
        </footer>
      </body>
    </html>
  );
}