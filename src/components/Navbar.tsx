'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarProps {
    categories: { id: number; nama: string }[];
}

export default function Navbar({ categories }: NavbarProps) {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <nav className="w-full bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-[100] border-b border-orange-100">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center">
                {/* Logo */}
                <Link href="/" className="text-2xl font-black text-orange-500 tracking-tighter hover:scale-105 transition-transform mb-4 md:mb-0 flex items-center gap-2">
                    <img src="/logo.png" alt="Logo Blog Flavory" className="h-8 w-8" />
                    Blog.Flavory.id
                </Link>

                {/* Menu Navigasi Utama */}
                <div className="flex flex-wrap items-center justify-center gap-5 md:gap-8">
                    <Link
                        href="/"
                        className={`text-sm font-bold transition-colors flex items-center gap-2 ${isActive('/') ? 'text-orange-500' : 'text-slate-600 hover:text-orange-500'
                            }`}
                    >
                        <i className="fa-solid fa-house"></i> Beranda
                    </Link>

                    <Link
                        href="#footer"
                        className={`text-sm font-bold transition-colors flex items-center gap-2 ${pathname === '#footer' ? 'text-orange-500' : 'text-slate-600 hover:text-orange-500'
                            }`}
                    >
                        <i className="fa-solid fa-envelope"></i> Kontak
                    </Link>

                    {/* Dropdown Kategori menggunakan Group Hover Tailwind */}
                    <div className="relative group">
                        <button className={`text-sm font-bold transition-colors flex items-center gap-2 py-2 cursor-pointer ${pathname.includes('/?kategori=') ? 'text-orange-500' : 'text-slate-600 hover:text-orange-500'
                            }`}>
                            <i className="fa-solid fa-tags"></i> Kategori <i className="fa-solid fa-chevron-down text-[10px] pt-0.5"></i>
                        </button>

                        {/* Panel Isi Dropdown */}
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
    );
}