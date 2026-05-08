'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. CREATE MULTIPLE KATEGORI
export async function createKategoriAction(data: { nama: string }[]) {
  try {
    // Filter input yang kosong
    const validData = data.filter(item => item.nama.trim() !== "");

    if (validData.length === 0) {
      return { success: false, message: "DATA_TIDAK_VALID: Nama kategori tidak boleh kosong." };
    }

    // skipDuplicates: true agar kalau Admin masukin nama kategori yang udah ada, gak error
    await prisma.kategori.createMany({
      data: validData,
      skipDuplicates: true
    });

    revalidatePath("/dashboard/kategori");
    return { success: true, message: "KATEGORI_BERHASIL_DITAMBAHKAN" };
  } catch {
    return { success: false, message: "CRITICAL_ERROR: Gagal menyimpan data." };
  }
}

// 2. UPDATE KATEGORI
export async function updateKategoriAction(id: number, nama: string) {
  try {
    if (!nama.trim()) return { success: false, message: "NAMA_TIDAK_BOLEH_KOSONG" };

    await prisma.kategori.update({
      where: { id },
      data: { nama },
    });
    revalidatePath("/dashboard/kategori");
    return { success: true, message: "KATEGORI_BERHASIL_DIPERBARUI" };
  } catch {
    return { success: false, message: "GAGAL_UPDATE_DATA: Mungkin nama sudah dipakai." };
  }
}

// 3. DELETE KATEGORI
export async function deleteKategoriAction(id: number) {
  try {
    await prisma.kategori.delete({ where: { id } });
    revalidatePath("/dashboard/kategori");
    return { success: true, message: "KATEGORI_BERHASIL_DIHAPUS" };
  } catch {
    return { success: false, message: "GAGAL_MENGHAPUS_DATA" };
  }
}