"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({ name: "", username: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [isMatch, setIsMatch] = useState(true);

  // Fungsi Ajax-style: Cek kecocokan password real-time
  useEffect(() => {
    if (formData.confirmPassword !== "") {
      setIsMatch(formData.password === formData.confirmPassword);
    }
  }, [formData.password, formData.confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMatch) return setError("Password tidak cocok");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) router.push("/login");
    else setError(data.error);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-orange-100">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Daftar Akun 🍊</h1>
        <p className="text-slate-500 mb-6">Bergabung dengan komunitas Flavory Blog.</p>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Nama Lengkap" required className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none" 
            onChange={(e) => setFormData({...formData, name: e.target.value})} />
          
          <input type="text" placeholder="Username" required className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none" 
            onChange={(e) => setFormData({...formData, username: e.target.value})} />

          <input type="email" placeholder="Email" required className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none" 
            onChange={(e) => setFormData({...formData, email: e.target.value})} />

          <div className="relative">
            <input type={showPass ? "text" : "password"} placeholder="Password" required className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-slate-400">
              {showPass ? "👁️" : "🙈"}
            </button>
          </div>

          <div>
            <input type="password" placeholder="Konfirmasi Password" required 
              className={`w-full p-3 rounded-xl border focus:ring-2 outline-none ${isMatch ? 'border-slate-200 focus:ring-orange-500' : 'border-red-500 focus:ring-red-500'}`} 
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
            {!isMatch && <p className="text-red-500 text-xs mt-1">Password tidak sama!</p>}
          </div>

          <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-orange-200">
            Daftar Sekarang
          </button>
        </form>

        <p className="mt-6 text-center text-slate-600 text-sm">
          Sudah punya akun? <Link href="/login" className="text-orange-600 font-bold hover:underline">Login di sini</Link>
        </p>
      </div>
    </main>
  );
}