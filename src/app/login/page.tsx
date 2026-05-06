"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) router.push("/dashboard"); // Redirect ke homepage
    else setError(data.error);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-orange-100">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Selamat Datang 👋</h1>
        <p className="text-slate-500 mb-6">Masuk ke dashboard Flavory Blog.</p>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Username" required className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none" 
            onChange={(e) => setFormData({...formData, username: e.target.value})} />

          <div className="relative">
            <input type={showPass ? "text" : "password"} placeholder="Password" required className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-slate-400">
              {showPass ? "👁️" : "🙈"}
            </button>
          </div>

          <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-orange-200">
            Masuk
          </button>
        </form>

        <p className="mt-6 text-center text-slate-600 text-sm">
          Belum punya akun? <Link href="/register" className="text-orange-600 font-bold hover:underline">Daftar Akun</Link>
        </p>
      </div>
    </main>
  );
}