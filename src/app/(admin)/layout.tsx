"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/actions/auth.actions";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: "fa-chart-line" },
    { name: "Blog", path: "/dashboard/blog", icon: "fa-newspaper" },
    { name: "Kategori", path: "/dashboard/kategori", icon: "fa-tags" },
    { name: "Ulasan", path: "/dashboard/ulasan", icon: "fa-comments" },
    { name: "Profil", path: "/dashboard/profile", icon: "fa-user-shield" },
  ];

  const handleLogout = async () => {
    if (confirm("Apakah Anda yakin ingin logout?")) {
      await logoutAction();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row">
      {/* SIDEBAR - Desktop */}
      <aside className={`hidden md:flex ${isOpen ? "w-64" : "w-20"} transition-all duration-300 border-r-2 border-orange-500/20 bg-slate-900 flex-col`}>
        <div className="p-4 md:p-6 flex items-center justify-between">
          {isOpen && <span className="font-black italic text-orange-500 tracking-tighter text-lg md:text-xl">Blog Flavory.id</span>}
          <button onClick={() => setIsOpen(!isOpen)} className="text-orange-500 hover:scale-110 transition-transform">
            <i className={`fas ${isOpen ? "fa-indent" : "fa-outdent"} text-lg`}></i>
          </button>
        </div>

        <nav className="flex-1 px-3 md:px-4 space-y-2 mt-4">
          {menu.map((item) => (
            <Link key={item.path} href={item.path} className={`flex items-center gap-3 md:gap-4 p-2 md:p-3 rounded-lg transition-all text-sm md:text-base ${pathname === item.path ? "bg-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]" : "text-slate-400 hover:text-orange-400 hover:bg-slate-800"}`}>
              <i className={`fas ${item.icon} w-6 text-center`}></i>
              {isOpen && <span className="font-bold uppercase tracking-widest">{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-3 md:p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 md:gap-4 p-2 md:p-3 text-red-500 hover:bg-red-500/10 w-full rounded-lg transition-all text-sm md:text-base">
            <i className="fas fa-power-off w-6 text-center"></i>
            {isOpen && <span className="font-bold uppercase">Logout</span>}
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="md:hidden bg-slate-900 border-b border-orange-500/20 p-4 flex items-center justify-between sticky top-0 z-40">
        <span className="font-black italic text-orange-500 text-lg">DASHBOARD ADMIN</span>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-orange-500 hover:scale-110 transition-transform text-xl"
        >
          <i className={`fas ${isMobileMenuOpen ? "fa-close" : "fa-bars"}`}></i>
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-orange-500/20">
          <nav className="flex flex-col p-4 space-y-2">
            {menu.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all text-sm ${pathname === item.path
                    ? "bg-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]"
                    : "text-slate-400 hover:text-orange-400 hover:bg-slate-800"
                  }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className={`fas ${item.icon} w-5`}></i>
                <span className="font-bold uppercase">{item.name}</span>
              </Link>
            ))}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-3 p-3 text-red-500 hover:bg-red-500/10 w-full rounded-lg transition-all text-sm"
            >
              <i className="fas fa-power-off w-5"></i>
              <span className="font-bold uppercase">Logout</span>
            </button>
          </nav>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 h-auto md:h-screen overflow-y-auto">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
