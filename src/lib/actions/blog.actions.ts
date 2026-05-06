'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Fungsi Helper buat Slug SEO Friendly
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

export async function createBlogAction(formData: FormData) {
  const title = formData.get("title") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const image = formData.get("image") as string; // Base64 hasil kompresi

  try {
    await prisma.post.create({
      data: {
        title,
        slug: `${generateSlug(title)}-${Date.now()}`,
        excerpt,
        content,
        image,
      },
    });
    revalidatePath("/dashboard");
    return { success: true, message: "DATA_TRANSMISSION_SUCCESS" };
  } catch (error) {
    return { success: false, message: "CRITICAL_DATABASE_ERROR" };
  }
}

// Logic Tambah Views (Dipanggil di halaman detail blog nantinya)
export async function incrementViews(slug: string) {
  await prisma.post.update({
    where: { slug },
    data: { views: { increment: 1 } },
  });
}