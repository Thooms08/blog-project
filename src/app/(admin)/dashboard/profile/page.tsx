// app/dashboard/profile/page.tsx
import prisma from "@/lib/prisma";
import Link from "next/link";
import IdentityForm from "./IdentityForm"; // Impor Komponen Client Identitas
import SecurityForm from "./SecurityForm"; // Impor Komponen Client Keamanan

export const dynamic = 'force-dynamic';

export default async function EditProfilePage() {
  // 1. Ambil data user langsung dari server (Prisma)
  const user = await prisma.user.findFirst({
    orderBy: { createdAt: 'desc' },
  });

  // Proteksi jika user tidak ada
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-orange-500 font-mono">
        FATAL_ERROR: DATA_NOT_FOUND_IN_SYSTEM
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER CYBERPUNK */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-orange-500/20 pb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
              User_<span className="text-orange-500">Profile</span>
            </h1>
            <p className="text-slate-500 font-mono text-sm mt-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> 
              Sistem Aktif : ID_{user.id.toString().padStart(4, '0')}
            </p>
          </div>
          <Link 
            href="/dashboard" 
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-orange-500 transition-all"
          >
            <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Kembali ke Dashboard
          </Link>
        </div>

        {/* GRID LAYOUT: MEMANGGIL KOMPONEN CLIENT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* 2. Panggil Komponen IdentityForm dan kirim data user sebagai props */}
          <IdentityForm user={user} />

          {/* 3. Panggil Komponen SecurityForm dan kirim userId sebagai props */}
          <SecurityForm userId={user.id} />

        </div>

        {/* FOOTER INFO */}
        <div className="mt-12 text-center border-t border-slate-800 pt-8">
          <p className="text-[10px] text-slate-600 uppercase tracking-[0.3em] font-mono">
            Secure Encryption Active // Protocol 0x-Orange-Blog
          </p>
        </div>

      </div>
    </main>
  );
}