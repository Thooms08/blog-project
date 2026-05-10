"use client";

import { useState, useTransition } from "react";
import { createKategoriAction, updateKategoriAction, deleteKategoriAction } from "@/lib/actions/kategori.actions";
import { CyberAlert } from "./sweetalert";

// Definisikan Tipe Data baru (ada relasi count posts)
type Kategori = {
  id: number;
  nama: string;
  _count: { posts: number };
};

// PERBAIKAN 1: Tambahkan default value = [] pada props kategoris
export default function KategoriClient({ kategoris = [] }: { kategoris: Kategori[] }) {
  const [isPending, startTransition] = useTransition();

  // State Form Multi-Input (Hanya Butuh Nama)
  const [inputs, setInputs] = useState([{ nama: "" }]);

  const handleAddInput = () => setInputs([...inputs, { nama: "" }]);
  const handleRemoveInput = (index: number) => setInputs(inputs.filter((_, i) => i !== index));
  const handleChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index].nama = value;
    setInputs(newInputs);
  };

  const handleSimpanBaru = () => {
    if (inputs.every(i => i.nama.trim() === "")) return CyberAlert.error("VALIDASI_GAGAL", "Isi minimal satu kategori.");

    startTransition(async () => {
      const res = await createKategoriAction(inputs);
      if (res.success) {
        CyberAlert.success("TRANSMISI_BERHASIL", res.message);
        setInputs([{ nama: "" }]); // Reset
      } else {
        CyberAlert.error("TRANSMISI_GAGAL", res.message);
      }
    });
  };

  // State Inline Edit
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNama, setEditNama] = useState("");

  const handleEditClick = (kategori: Kategori) => {
    setEditingId(kategori.id);
    setEditNama(kategori.nama);
  };

  const handleSimpanEdit = (id: number) => {
    startTransition(async () => {
      const res = await updateKategoriAction(id, editNama);
      if (res.success) {
        CyberAlert.success("UPDATE_BERHASIL", res.message);
        setEditingId(null);
      } else CyberAlert.error("UPDATE_GAGAL", res.message);
    });
  };

  const handleHapus = async (id: number) => {
    const result = await CyberAlert.confirmDelete();
    if (result.isConfirmed) {
      startTransition(async () => {
        const res = await deleteKategoriAction(id);
        if (res.success) CyberAlert.success("DELETED", res.message);
        else CyberAlert.error("ERROR", res.message);
      });
    }
  };

  const inputClass = "w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-orange-400 focus:border-orange-500 outline-none transition-all font-mono text-sm";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* FORM INPUT KATEGORI (MANDIRI) */}
      <section className="bg-slate-900 border-t-4 border-orange-600 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
          <i className="fas fa-layer-group text-orange-500"></i> Buat Kategori Baru
        </h2>

        <div className="space-y-4">
          {/* PERBAIKAN 2: Tambahkan optional chaining (?) pada inputs.map */}
          {inputs?.map((input, index) => (
            <div key={index} className="flex gap-4 items-center bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <i className="fas fa-hashtag text-slate-500 ml-2"></i>
              <input
                type="text"
                placeholder="Misal: Teknologi, Tutorial, Gaya Hidup..."
                value={input.nama}
                onChange={(e) => handleChange(index, e.target.value)}
                className={inputClass}
              />
              {inputs.length > 1 && (
                <button onClick={() => handleRemoveInput(index)} className="p-3 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all">
                  <i className="fas fa-trash"></i>
                </button>
              )}
            </div>
          ))}

          <div className="flex gap-4 pt-4 border-t border-slate-800">
            <button onClick={handleAddInput} className="px-6 py-3 border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-bold rounded-lg uppercase text-xs transition-all flex items-center gap-2">
              <i className="fas fa-plus"></i> Tambah Kolom
            </button>
            <button onClick={handleSimpanBaru} disabled={isPending} className="flex-1 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-lg uppercase text-xs transition-all tracking-widest">
              {isPending ? "MEMPROSES..." : "SIMPAN KE DATABASE"}
            </button>
          </div>
        </div>
      </section>

      {/* TABEL DATA KATEGORI - DESKTOP */}
      <section className="hidden md:block bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800">
              <th className="p-4 text-xs font-bold text-orange-500 uppercase tracking-widest w-16 text-center">NO</th>
              <th className="p-4 text-xs font-bold text-orange-500 uppercase tracking-widest">NAMA KATEGORI</th>
              <th className="p-4 text-xs font-bold text-orange-500 uppercase tracking-widest text-center">TOTAL POSTINGAN</th>
              <th className="p-4 text-xs font-bold text-orange-500 uppercase tracking-widest text-center w-40">AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {(!kategoris || kategoris.length === 0) ? (
              <tr><td colSpan={4} className="p-8 text-center text-slate-500 font-mono">DATABASE_KOSONG</td></tr>
            ) : (
              kategoris?.map((kat, idx) => (
                <tr key={kat.id} className="hover:bg-slate-800/30 transition-all">
                  <td className="p-4 text-center font-mono text-slate-500">{idx + 1}</td>
                  <td className="p-4">
                    {editingId === kat.id ? (
                      <input type="text" value={editNama} onChange={(e) => setEditNama(e.target.value)} className={`${inputClass} !p-2`} autoFocus />
                    ) : (
                      <span className="font-bold text-slate-200">
                        <span className="text-orange-500 mr-1">#</span>{kat.nama}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <span className="bg-slate-950 border border-slate-700 px-3 py-1 rounded-full text-xs font-mono text-slate-400">
                      {kat._count?.posts || 0} Digunakan
                    </span>
                  </td>
                  <td className="p-4 text-center space-x-3">
                    {editingId === kat.id ? (
                      <>
                        <button onClick={() => handleSimpanEdit(kat.id)} disabled={isPending} className="text-green-500 hover:text-green-400"><i className="fas fa-check"></i></button>
                        <button onClick={() => setEditingId(null)} className="text-slate-500 hover:text-slate-400"><i className="fas fa-times"></i></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditClick(kat)} className="text-slate-400 hover:text-orange-500 transition-colors"><i className="fas fa-edit"></i></button>
                        <button onClick={() => handleHapus(kat.id)} className="text-slate-400 hover:text-red-500 transition-colors"><i className="fas fa-trash-alt"></i></button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* CARD LAYOUT - MOBILE */}
      <section className="md:hidden space-y-4">
        {(!kategoris || kategoris.length === 0) ? (
          <div className="p-8 text-center text-slate-500 font-mono bg-slate-900 rounded-lg border border-slate-800">
            DATABASE_KOSONG
          </div>
        ) : (
          kategoris?.map((kat, idx) => (
            <div key={kat.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3 hover:border-orange-500 transition-all">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  {editingId === kat.id ? (
                    <input type="text" value={editNama} onChange={(e) => setEditNama(e.target.value)} className={`${inputClass} !p-2`} autoFocus />
                  ) : (
                    <span className="font-bold text-slate-200 text-base">
                      <span className="text-orange-500 mr-2">#{idx + 1}</span>{kat.nama}
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-slate-800/50 rounded p-2">
                <span className="text-xs font-mono text-slate-400">
                  <span className="text-orange-500 font-bold">{kat._count?.posts || 0}</span> postingan
                </span>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-800">
                {editingId === kat.id ? (
                  <>
                    <button onClick={() => handleSimpanEdit(kat.id)} disabled={isPending} className="flex-1 py-2 bg-green-600/20 hover:bg-green-600/40 text-green-400 rounded text-xs font-bold transition-colors">
                      <i className="fas fa-check"></i> Simpan
                    </button>
                    <button onClick={() => setEditingId(null)} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded text-xs font-bold transition-colors">
                      <i className="fas fa-times"></i> Batal
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditClick(kat)} className="flex-1 py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded text-xs font-bold transition-colors">
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button onClick={() => handleHapus(kat.id)} className="flex-1 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded text-xs font-bold transition-colors">
                      <i className="fas fa-trash-alt"></i> Hapus
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}