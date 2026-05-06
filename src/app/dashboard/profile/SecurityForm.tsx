"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { updatePasswordAction } from "@/lib/actions/profile.actions";
import { SubmitButton } from "./SubmitButton";
import { cyberpunkAlert } from "@/lib/swal-theme";
import { useRouter } from "next/navigation";

export default function SecurityForm({ userId }: { userId: number }) {
  const router = useRouter();
  const [state, formAction] = useFormState(updatePasswordAction, null);
  
  // Logic Mata Password & Match (Sama seperti sebelumnya)
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwords, setPasswords] = useState({ pwd: "", confirm: "" });
  const [isMatch, setIsMatch] = useState(true);

  useEffect(() => {
    if (passwords.confirm.length > 0) setIsMatch(passwords.pwd === passwords.confirm);
  }, [passwords]);

  // Handle SweetAlert jika action berhasil
  useEffect(() => {
    if (state?.success) {
      cyberpunkAlert(state.title, state.message, 'success').then(() => {
        router.push("/dashboard");
      });
    } else if (state?.success === false) {
      cyberpunkAlert(state.title, state.message, 'error');
    }
  }, [state, router]);

  const inputClass = "w-full bg-slate-900/50 border-2 border-slate-700 pl-11 pr-12 py-3 rounded-lg text-orange-400 focus:border-orange-500 outline-none transition-all font-mono";

  return (
    <div className="bg-slate-900 border-t-4 border-orange-600 p-8 rounded-2xl shadow-xl relative overflow-hidden">
      <h2 className="text-xl font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
        <i className="fas fa-shield-halved text-orange-500"></i> Keamanan
      </h2>

      <form action={formAction} className="space-y-5">
        <input type="hidden" name="userId" value={userId} />
        
        {/* Input Password Baru */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Input_Sandi_Baru</label>
          <div className="relative">
            <i className="fas fa-key absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
            <input 
              type={showPwd ? "text" : "password"} 
              name="password" 
              required 
              className={inputClass}
              onChange={(e) => setPasswords({...passwords, pwd: e.target.value})}
            />
            <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
              <i className={`fas ${showPwd ? "fa-eye-slash" : "fa-eye"}`}></i>
            </button>
          </div>
        </div>

        {/* Input Konfirmasi Password */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Verifikasi_Sandi</label>
          <div className="relative">
            <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
            <input 
              type={showConfirm ? "text" : "password"} 
              required 
              className={`${inputClass} ${!isMatch ? 'border-red-500' : ''}`}
              onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
              <i className={`fas ${showConfirm ? "fa-eye-slash" : "fa-eye"}`}></i>
            </button>
          </div>
          {!isMatch && <p className="text-[10px] text-red-500 font-bold italic uppercase">Galat: Sandi Tidak Identik</p>}
        </div>

        <SubmitButton label="Sinkronkan Sandi" icon="fa-sync" disabled={!isMatch || passwords.pwd === ""} />
      </form>
    </div>
  );
}