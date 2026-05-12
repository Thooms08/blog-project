"use client";

import { useState } from "react";
import { submitUlasanAction } from "@/lib/actions/ulasan.actions";

interface FormUlasanProps {
  postId: number;
}

export default function FormUlasanPrivat({ postId }: FormUlasanProps) {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi Front-end
    if (rating === 0) {
      setStatus({ success: false, message: "Mohon pilih rating bintang terlebih dahulu." });
      return;
    }

    setIsLoading(true);
    setStatus(null);

    // Panggil Server Action
    const result = await submitUlasanAction({ postId, rating, comment });

    if (result.success) {
      setStatus({ success: true, message: result.message });
      setRating(0);
      setComment("");
    } else {
      setStatus({ success: false, message: result.error });
    }
    
    setIsLoading(false);
  };

  // State Sukses
  if (status?.success) {
    return (
      <div className="bg-orange-50 border border-orange-100 p-8 rounded-2xl text-center mt-12 shadow-sm animate-fade-in">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm">
          🎉
        </div>
        <h3 className="text-2xl font-extrabold text-slate-800 mb-2">Selesai!</h3>
        <p className="text-orange-600 font-semibold mb-1">{status.message}</p>
        <p className="text-sm text-slate-500 font-medium">Ulasan ini bersifat privat dan hanya dilihat oleh pengelola blog.</p>
      </div>
    );
  }

  // Tampilan Form
  return (
    <div className="bg-white border border-slate-100 shadow-sm p-6 md:p-8 rounded-2xl mt-12">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <i className="fa-solid fa-comment-dots text-orange-500"></i> Beri Penilaian
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Bantu kami menjadi lebih baik! Masukan Anda bersifat <span className="font-bold text-slate-700">privat</span>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Rating Bintang Interaktif */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Seberapa bermanfaat artikel ini? <span className="text-red-500">*</span></label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className={`text-3xl transition-colors duration-200 focus:outline-none ${
                  star <= (hover || rating) ? "text-orange-400" : "text-slate-200"
                }`}
              >
                <i className="fa-solid fa-star"></i>
              </button>
            ))}
          </div>
        </div>

        {/* Textarea Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-semibold text-slate-700 mb-2">
            Pesan / Saran (Opsional)
          </label>
          <textarea
            id="comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tulis pendapat atau perbaikan yang Anda inginkan..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none resize-y text-slate-700 placeholder:text-slate-400"
          ></textarea>
        </div>

        {/* Notifikasi Error jika ada */}
        {status?.success === false && (
          <div className="p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-lg flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation"></i> {status.message}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto self-end bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md shadow-orange-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <><i className="fa-solid fa-spinner animate-spin"></i> Mengirim...</>
          ) : (
            <><i className="fa-regular fa-paper-plane"></i> Kirim Ulasan</>
          )}
        </button>
      </form>
    </div>
  );
}