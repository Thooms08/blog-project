'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function updateProfileAction(prevState: any, formData: FormData) {
  const userId = formData.get("userId") as string;
  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;

  try {
    await prisma.user.update({
      where: { id: Number(userId) },
      data: { name, username, email },
    });
    revalidatePath("/dashboard/profile");
    return { success: true, title: "SISTEM DIPERBARUI", message: "Data identitas berhasil disinkronisasi." };
  } catch (error) {
    return { success: false, title: "ERROR SISTEM", message: "Gagal menyambung ke database." };
  }
}

export async function updatePasswordAction(prevState: any, formData: FormData) {
  const userId = formData.get("userId") as string;
  const password = formData.get("password") as string;

  try {
    // 2. HASH PASSWORD SEBELUM DISIMPAN (Salt = 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: Number(userId) },
      data: { password: hashedPassword }, // 3. SIMPAN VERSI HASH
    });
    
    revalidatePath("/dashboard/profile");
    return { success: true, title: "DEKRIPSI BERHASIL", message: "Sandi baru telah diamankan di database." };
  } catch (error) {
    return { success: false, title: "ERROR KEAMANAN", message: "Gagal memperbarui sandi." };
  }
}
