'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

// ==========================================
// FUNGSI HELPER (BANTUAN)
// ==========================================

// 1. Bikin Slug Murni (SEO Friendly) dari Judul
const generateBaseSlug = (title: string) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// 2. Cek ke Database biar Slug Unik
const createUniqueSlug = async (title: string) => {
  const baseSlug = generateBaseSlug(title);
  let slug = baseSlug;
  let isUnique = false;

  while (!isUnique) {
    const existingPost = await prisma.post.findUnique({ where: { slug } });
    if (!existingPost) {
      isUnique = true;
    } else {
      const randomNum = Math.floor(Math.random() * 999) + 1;
      slug = `${baseSlug}-${randomNum}`;
    }
  }
  return slug;
};

// 3. Simpan Gambar Base64 ke folder lokal (public/assets/post)
async function saveImageLocally(base64Data: string, slug: string) {
  const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) throw new Error("Format gambar tidak valid");

  const extension = matches[1].split('/')[1];
  const buffer = Buffer.from(matches[2], 'base64');
  const fileName = `${slug}-${Date.now()}.${extension}`;

  const dirPath = path.join(process.cwd(), 'public', 'assets', 'post');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, fileName);
  fs.writeFileSync(filePath, buffer);

  return `/public/assets/post/${fileName}`;
}


// ==========================================
// FUNGSI UTAMA (SERVER ACTIONS)
// ==========================================

const EXCERPT_MAX_LENGTH = 150;

// A. ACTION BUAT BLOG BARU
export async function createBlogAction(data: {
  title: string;
  excerpt: string;
  content: string;
  imageBase64?: string;
  kategoriIds: number[];
}) {
  try {
    if (!data.title || !data.content) {
      return { success: false, message: "Judul dan Konten wajib diisi." };
    }
    if (data.excerpt.length > EXCERPT_MAX_LENGTH) {
      return { success: false, message: `Excerpt maksimal ${EXCERPT_MAX_LENGTH} karakter.` };
    }

    const excerpt = data.excerpt.slice(0, EXCERPT_MAX_LENGTH);
    const slug = await createUniqueSlug(data.title);

    let imagePath = null;
    if (data.imageBase64) {
      imagePath = await saveImageLocally(data.imageBase64, slug);
    }

    await prisma.post.create({
      data: {
        title: data.title,
        slug: slug,
        excerpt: excerpt,
        content: data.content,
        image: imagePath,
        kategoris: {
          connect: data.kategoriIds.map((id) => ({ id }))
        }
      },
    });

    revalidatePath("/dashboard/blog");
    return { success: true, message: "Blog berhasil dipublikasikan." };
  } catch (error) {
    console.error("Error Create Blog:", error);
    return { success: false, message: "Gagal menyimpan postingan." };
  }
}

// B. ACTION EDIT/UPDATE BLOG
export async function updateBlogAction(id: number, data: {
  title: string;
  excerpt: string;
  content: string;
  imageBase64?: string;
  kategoriIds: number[];
}) {
  try {
    if (!data.title || !data.content) {
      return { success: false, message: "Judul dan Konten wajib diisi." };
    }
    if (data.excerpt.length > EXCERPT_MAX_LENGTH) {
      return { success: false, message: `Excerpt maksimal ${EXCERPT_MAX_LENGTH} karakter.` };
    }

    const excerpt = data.excerpt.slice(0, EXCERPT_MAX_LENGTH);

    const postLama = await prisma.post.findUnique({ where: { id } });
    if (!postLama) {
      return { success: false, message: "Postingan tidak ditemukan di database." };
    }

    let imagePath = postLama.image;

    if (data.imageBase64) {
      imagePath = await saveImageLocally(data.imageBase64, postLama.slug);

      if (postLama.image && postLama.image.startsWith('/public/assets/')) {
        const oldImagePath = path.join(process.cwd(), 'public', postLama.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    await prisma.post.update({
      where: { id },
      data: {
        title: data.title,
        excerpt: excerpt,
        content: data.content,
        image: imagePath,
        kategoris: {
          set: [],
          connect: data.kategoriIds.map((id) => ({ id }))
        }
      },
    });

    revalidatePath("/dashboard/blog");
    return { success: true, message: "Blog berhasil diperbarui." };
  } catch (error) {
    console.error("Error Update Blog:", error);
    return { success: false, message: "Gagal memperbarui postingan." };
  }
}

// C. ACTION TAMBAH VIEWS
export async function incrementViews(slug: string) {
  try {
    await prisma.post.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });
  } catch (error) {
    console.error("Gagal menambah views:", error);
  }
}

// D. ACTION HAPUS BLOG
export async function deleteBlogAction(id: number) {
  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return { success: false, message: "Postingan tidak ditemukan." };
    }

    if (post.image && post.image.startsWith('/public/assets/')) {
      const imagePath = path.join(process.cwd(), 'public', post.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await prisma.post.delete({ where: { id } });

    revalidatePath("/dashboard/blog");
    return { success: true, message: "Blog berhasil dihapus." };
  } catch (error) {
    console.error("Error Delete Blog:", error);
    return { success: false, message: "Gagal menghapus postingan." };
  }
}
