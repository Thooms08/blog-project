// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4">
        {/* Animasi Spinner Bulat */}
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">Memuat data...</p>
      </div>
    </div>
  );
}