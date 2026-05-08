export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      
      {/* Spinner Animasi Oranye */}
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500"></div>

      {/* Teks Loading */}
      <h2 className="mt-6 text-xl font-bold text-slate-800 animate-pulse">
        Memuat...
      </h2>
      
    </div>
  );
}