"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Tambahan state loading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/dashboard"); // Redirect ke dashboard
      } else {
        setError(data.error || "Login gagal, silakan coba lagi.");
      }
    } catch {
      setError("Terjadi kesalahan pada server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-md border border-orange-100">

        {/* Header dengan Font Awesome */}
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2 flex items-center gap-3">
          Selamat Datang <i className="fa-solid fa-hand-sparkles text-orange-500"></i>
        </h1>
        <p className="text-slate-500 mb-8 font-medium">Masuk ke dashboard Blog.Flavory.id.</p>

        {/* Pesan Error dengan Icon */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-semibold flex items-center gap-2 animate-fade-in">
            <i className="fa-solid fa-circle-exclamation"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Input Username */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <i className="fa-solid fa-user"></i>
            </div>
            <input
              type="text"
              placeholder="Username"
              required
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all text-slate-700 bg-slate-50"
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          {/* Input Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <i className="fa-solid fa-lock"></i>
            </div>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              required
              className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all text-slate-700 bg-slate-50"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {/* Tombol Toggle Password Font Awesome */}
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500 transition-colors w-8 h-8 flex items-center justify-center rounded-full focus:outline-none"
            >
              <i className={`fa-solid ${showPass ? "fa-eye" : "fa-eye-slash"}`}></i>
            </button>
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {isLoading ? (
              <><i className="fa-solid fa-spinner animate-spin"></i> Memproses...</>
            ) : (
              <><i className="fa-solid fa-arrow-right-to-bracket"></i> Masuk Sekarang</>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-sm font-medium">
          Belum punya akun? <Link href="/register" className="text-orange-600 font-bold hover:underline ml-1">Daftar Akun</Link>
        </p>
      </div>
    </main>
  );
}