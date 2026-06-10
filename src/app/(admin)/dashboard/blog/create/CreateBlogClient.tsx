"use client";

import dynamic from 'next/dynamic';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createBlogAction, updateBlogAction } from '@/lib/actions/blog.actions';
import { CyberAlert } from '../../kategori/sweetalert';

const CustomEditor = dynamic(() => import('@/components/Editor'), {
  ssr: false,
  loading: () => <div className="h-64 bg-slate-900 animate-pulse rounded-xl border-2 border-slate-800 flex items-center justify-center text-slate-500">LOADING_EDITOR_MODULE...</div>
});

type Kategori = { id: number; nama: string };
// Tambahkan tipe untuk Edit Mode
type PostData = { id: number; title: string; excerpt: string | null; content: string; image: string | null; kategoris: { id: number }[] };

const EXCERPT_MAX_LENGTH = 150;

export default function CreateBlogClient({ kategoris, initialData }: { kategoris: Kategori[], initialData?: PostData }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isEditMode = !!initialData;

  // States
  const [title, setTitle] = useState(initialData?.title || "");
  const [excerpt, setExcerpt] = useState(() => (initialData?.excerpt || "").slice(0, EXCERPT_MAX_LENGTH));
  const [content, setContent] = useState(initialData?.content || "");
  const [selectedKategoris, setSelectedKategoris] = useState<number[]>(
    initialData?.kategoris.map(k => k.id) || []
  );

  // States Image
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);
  const [imageBase64, setImageBase64] = useState<string>("");

  const toggleKategori = (id: number) => {
    setSelectedKategoris(prev => prev.includes(id) ? prev.filter(kId => kId !== id) : [...prev, id]);
  };

  const handleExcerptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setExcerpt(e.target.value.slice(0, EXCERPT_MAX_LENGTH));
  };

  // Handler Upload Thumbnail Max 1MB
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi Ukuran (1MB = 1048576 bytes)
    if (file.size > 1048576) {
      e.target.value = ""; // Reset input
      return CyberAlert.error("UKURAN TERLALU BESAR", "Thumbnail maksimal berukuran 1MB.");
    }

    // Convert ke Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result as string);
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() === "") return CyberAlert.error("ERROR", "Konten blog tidak boleh kosong.");
    if (excerpt.length > EXCERPT_MAX_LENGTH) return CyberAlert.error("ERROR", `Excerpt maksimal ${EXCERPT_MAX_LENGTH} karakter.`);

    startTransition(async () => {
      const payload = { title, excerpt, content, imageBase64, kategoriIds: selectedKategoris };

      let res;
      if (isEditMode) {
        res = await updateBlogAction(initialData.id, payload);
      } else {
        res = await createBlogAction(payload);
      }

      if (res?.success) {
        CyberAlert.success("BERHASIL", res.message).then(() => router.push("/dashboard/blog"));
      } else {
        CyberAlert.error("GAGAL", res?.message || "Terjadi kesalahan.");
      }
    });
  };

  const inputClass = "w-full bg-slate-900 border-2 border-slate-700 p-4 rounded-xl text-orange-400 placeholder:text-slate-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all font-mono";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500">

      {/* METADATA & GAMBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border-t-4 border-orange-600 p-6 rounded-2xl shadow-xl space-y-4">
          <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4 flex items-center gap-3">
            <i className="fas fa-keyboard text-orange-500"></i> Metadata Postingan
          </h2>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Judul_Postingan</label>
            <input type="text" placeholder="Ketik judul menarik di sini..." value={title} onChange={(e) => setTitle(e.target.value)} required className={inputClass} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Excerpt_(Ringkasan_Singkat)</label>
            <textarea
              placeholder="Tuliskan ringkasan 1-2 kalimat..."
              value={excerpt}
              onChange={handleExcerptChange}
              maxLength={EXCERPT_MAX_LENGTH}
              rows={3}
              className={`${inputClass} resize-none`}
            />
            <p className={`text-right text-[10px] font-mono tracking-widest ${excerpt.length >= EXCERPT_MAX_LENGTH ? "text-orange-500" : "text-slate-500"}`}>
              {excerpt.length}/{EXCERPT_MAX_LENGTH}
            </p>
          </div>
        </div>

        {/* THUMBNAIL UPLOAD */}
        <div className="bg-slate-900 border-t-4 border-orange-600 p-6 rounded-2xl shadow-xl space-y-4 flex flex-col">
          <h2 className="text-xl font-black text-white uppercase tracking-widest mb-2 flex items-center gap-3">
            <i className="fas fa-image text-orange-500"></i> Thumbnail
          </h2>
          <div className="min-h-[220px] sm:min-h-[260px] lg:min-h-[280px] w-full border-2 border-dashed border-slate-700 rounded-xl relative overflow-hidden group bg-slate-950">
            {imagePreview ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Preview thumbnail"
                  className="absolute inset-0 w-full h-full object-contain opacity-90 group-hover:opacity-70 transition-all pointer-events-none"
                />
                {isEditMode && !imageBase64 && (
                  <span className="absolute bottom-2 left-2 right-2 text-center text-[10px] font-mono text-orange-400 bg-slate-950/80 py-1 rounded pointer-events-none">
                    Thumbnail saat ini — klik untuk ganti
                  </span>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-center text-slate-500 font-mono text-xs">
                <div>
                  <i className="fas fa-cloud-upload-alt text-3xl mb-2 text-slate-600"></i>
                  <p>Klik / Drag File</p>
                  <p className="text-[10px] text-orange-500 mt-1">MAX 1 MB</p>
                </div>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* PILIH KATEGORI */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
        <label className="text-[10px] font-bold text-orange-500 uppercase tracking-widest block mb-2"><i className="fas fa-tags mr-2"></i>Klasifikasi_Kategori</label>
        <div className="flex flex-wrap gap-3">
          {kategoris.map((kat) => {
            const isSelected = selectedKategoris.includes(kat.id);
            return (
              <button key={kat.id} type="button" onClick={() => toggleKategori(kat.id)} className={`px-4 py-2 rounded-full border text-xs font-bold font-mono transition-all duration-300 ${isSelected ? "bg-orange-600 border-orange-500 text-white shadow-[0_0_10px_rgba(234,88,12,0.5)]" : "bg-slate-950 border-slate-700 text-slate-400 hover:border-orange-500 hover:text-orange-400"}`}>
                {isSelected && <i className="fas fa-check mr-2"></i>} #{kat.nama}
              </button>
            );
          })}
        </div>
      </div>

      {/* EDITOR KONTEN */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
        <label className="text-[10px] font-bold text-orange-500 uppercase tracking-widest block mb-2"><i className="fas fa-pen-nib mr-2"></i>Konten_Utama</label>
        <div className="border border-slate-700 rounded-xl overflow-hidden">
          {/* Kirim value awal content ke editor */}
          <CustomEditor value={content} onChange={(data) => setContent(data)} />
        </div>
      </div>

      {/* TOMBOL SUBMIT (DINAMIS SESUAI MODE) */}
      <div className="pt-4 pb-12">
        <button type="submit" disabled={isPending} className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-4 rounded-xl uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed">
          {isPending ? (
            <span className="flex items-center justify-center gap-3"><i className="fas fa-circle-notch fa-spin"></i> MEMPROSES_SINKRONISASI...</span>
          ) : (
            <span className="flex items-center justify-center gap-3"><i className="fas fa-satellite-dish"></i> {isEditMode ? "UPDATE_POSTINGAN" : "PUBLIKASIKAN_POSTINGAN"}</span>
          )}
        </button>
      </div>
    </form>
  );
}