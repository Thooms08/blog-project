"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ label, icon, disabled = false }: { label: string, icon: string, disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={`w-full font-black py-4 rounded-lg uppercase tracking-widest text-xs transition-all duration-300 flex items-center justify-center gap-3 border-b-4
        ${pending || disabled
          ? "bg-slate-800 text-slate-600 border-slate-900 cursor-not-allowed opacity-50" 
          : "bg-orange-600 text-white border-orange-800 hover:bg-orange-500 hover:-translate-y-1 active:translate-y-0"
        }`}
    >
      {pending ? (
        <i className="fas fa-circle-notch fa-spin"></i>
      ) : (
        <i className={`fas ${icon}`}></i>
      )}
      <span>{pending ? "Memproses..." : label}</span>
    </button>
  );
}