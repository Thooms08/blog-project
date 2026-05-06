"use client";

import { useFormState } from "react-dom";
import { useEffect } from "react";
import { updateProfileAction } from "@/lib/actions/profile.actions";
import { SubmitButton } from "./SubmitButton";
import { cyberpunkAlert } from "@/lib/swal-theme";
import { useRouter } from "next/navigation";

export default function IdentityForm({ user }: { user: any }) {
  const router = useRouter();
  // State untuk menangkap respon dari Server Action
  const [state, formAction] = useFormState(updateProfileAction, null);

  // Munculkan SweetAlert jika berhasil
  useEffect(() => {
    if (state?.success) {
      cyberpunkAlert(state.title, state.message, 'success').then(() => {
        router.push("/dashboard");
      });
    } else if (state?.success === false) {
      cyberpunkAlert(state.title, state.message, 'error');
    }
  }, [state, router]);

  const inputClass = "w-full bg-slate-900/50 border-2 border-slate-700 pl-11 pr-4 py-3 rounded-lg text-orange-400 placeholder:text-slate-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all duration-300 font-mono";
  const labelClass = "text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] ml-1";

  return (
    <section className="bg-slate-900 border-t-4 border-slate-700 p-8 rounded-2xl shadow-xl relative overflow-hidden group">
      {/* Dekorasi Sudut Cyberpunk */}
      <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl text-white pointer-events-none">
        <i className="fas fa-id-card"></i>
      </div>

      <h2 className="text-xl font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
        <i className="fas fa-user-gear text-orange-500"></i> Identitas Bio
      </h2>

      <form action={formAction} className="space-y-6">
        {/* ID Tersembunyi */}
        <input type="hidden" name="userId" value={user.id} />

        {/* KOLOM NAMA */}
        <div className="space-y-2">
          <label className={labelClass}>Nama_Alias</label>
          <div className="relative group">
            <i className="fas fa-user-ninja absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-colors"></i>
            <input 
              type="text" 
              name="name" 
              defaultValue={user.name} 
              placeholder="Masukkan nama..."
              required 
              className={inputClass} 
            />
          </div>
        </div>

        {/* KOLOM USERNAME */}
        <div className="space-y-2">
          <label className={labelClass}>Akses_Username</label>
          <div className="relative group">
            <i className="fas fa-at absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-colors"></i>
            <input 
              type="text" 
              name="username" 
              defaultValue={user.username} 
              placeholder="username_baru"
              required 
              className={inputClass} 
            />
          </div>
        </div>

        {/* KOLOM EMAIL */}
        <div className="space-y-2">
          <label className={labelClass}>Jalur_Komunikasi_Email</label>
          <div className="relative group">
            <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-colors"></i>
            <input 
              type="email" 
              name="email" 
              defaultValue={user.email} 
              placeholder="alamat@email.com"
              required 
              className={inputClass} 
            />
          </div>
        </div>

        {/* TOMBOL SUBMIT */}
        <div className="pt-4">
          <SubmitButton label="Perbarui Identitas" icon="fa-user-check" />
        </div>
      </form>
    </section>
  );
}