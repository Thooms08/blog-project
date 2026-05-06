"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: "fa-chart-line" },
    { name: "Blog", path: "/dashboard/blog", icon: "fa-newspaper" },
    { name: "Kategori", path: "/dashboard/kategori", icon: "fa-tags" },
    { name: "Ulasan", path: "/dashboard/reviews", icon: "fa-comments" },
    { name: "Profil", path: "/dashboard/profile", icon: "fa-user-shield" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex">
      {/* SIDEBAR */}
      <aside className={`${isOpen ? "w-64" : "w-20"} transition-all duration-300 border-r-2 border-orange-500/20 bg-slate-900 flex flex-col`}>
        <div className="p-6 flex items-center justify-between">
          {isOpen && <span className="font-black italic text-orange-500 tracking-tighter text-xl">ORANGE_SYSTEM</span>}
          <button onClick={() => setIsOpen(!isOpen)} className="text-orange-500 hover:scale-110 transition-transform">
            <i className={`fas ${isOpen ? "fa-indent" : "fa-outdent"} text-lg`}></i>
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menu.map((item) => (
            <Link key={item.path} href={item.path} className={`flex items-center gap-4 p-3 rounded-lg transition-all ${pathname === item.path ? "bg-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]" : "text-slate-400 hover:text-orange-400 hover:bg-slate-800"}`}>
              <i className={`fas ${item.icon} w-6 text-center`}></i>
              {isOpen && <span className="text-sm font-bold uppercase tracking-widest">{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-4 p-3 text-red-500 hover:bg-red-500/10 w-full rounded-lg transition-all">
            <i className="fas fa-power-off w-6 text-center"></i>
            {isOpen && <span className="text-sm font-bold uppercase">Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 h-screen overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}