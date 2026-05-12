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
    .replace(/[^\w\s-]/g, '') // Hapus karakter spesial (hanya huruf, angka, spasi, strip)
    .replace(/[\s_]+/g, '-')  // Ganti spasi atau underscore dengan strip (-)
    .replace(/^-+|-+$/g, ''); // Hapus strip di awal/akhir jika ada
};

// 2. Cek ke Database biar Slug Unik
const createUniqueSlug = async (title: string) => {
  const baseSlug = generateBaseSlug(title);
  let slug = baseSlug;
  let isUnique = false;

  while (!isUnique) {
    const existingPost = await prisma.post.findUnique({ where: { slug } });
    if (!existingPost) {
      isUnique = true; // Slug aman, belum dipakai!
    } else {
      // Jika sudah dipakai, tambah angka random (1 - 999) di belakangnya
      const randomNum = Math.floor(Math.random() * 999) + 1;
      slug = `${baseSlug}-${randomNum}`;
    }
  }
  return slug;
};

// 3. Simpan Gambar Base64 ke folder lokal (public/assets/post)
async function saveImageLocally(base64Data: string, slug: string) {
  // Pisahkan header data base64 (cth: "data:image/png;base64,...")
  const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) throw new Error("Format gambar tidak valid");

  const extension = matches[1].split('/')[1]; // dapatkan format (jpeg, png, dll)
  const buffer = Buffer.from(matches[2], 'base64');
  const fileName = `${slug}-${Date.now()}.${extension}`; // Nama file unik

  // Pastikan folder public/assets/post tersedia, jika belum maka buat otomatis
  const dirPath = path.join(process.cwd(), 'public', 'assets', 'post');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, fileName);
  fs.writeFileSync(filePath, buffer);

  // Kembalikan path URL yang akan disimpan ke database Prisma
  return `/assets/post/${fileName}`;
}


// ==========================================
// FUNGSI UTAMA (SERVER ACTIONS)
// ==========================================

// A. ACTION BUAT BLOG BARU
export async function createBlogAction(data: {
  title: string;
  excerpt: string;
  content: string;
  imageBase64?: string;
  kategoriIds: number[];
}) {
  try {
    // 1. Validasi sederhana
    if (!data.title || !data.content) {
      return { success: false, message: "Judul dan Konten wajib diisi." };
    }

    // 2. Dapatkan Slug Unik
    const slug = await createUniqueSlug(data.title);

    // 3. Proses Gambar (Jika ada)
    let imagePath = null;
    if (data.imageBase64) {
      imagePath = await saveImageLocally(data.imageBase64, slug);
    }

    // 4. Simpan ke Database
    await prisma.post.create({
      data: {
        title: data.title,
        slug: slug,
        excerpt: data.excerpt,
        content: data.content,
        image: imagePath,
        // Menyambungkan relasi Many-to-Many Kategori secara otomatis
        kategoris: {
          connect: data.kategoriIds.map((id) => ({ id }))
        }
      },
    });

    // 5. Refresh halaman tabel blog
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
    // 1. Validasi sederhana
    if (!data.title || !data.content) {
      return { success: false, message: "Judul dan Konten wajib diisi." };
    }

    // 2. Cari postingan lama untuk mengambil slug dan gambar lamanya
    const postLama = await prisma.post.findUnique({ where: { id } });
    if (!postLama) {
      return { success: false, message: "Postingan tidak ditemukan di database." };
    }

    // 3. Tentukan gambar mana yang dipakai
    let imagePath = postLama.image; // Secara default, gunakan path gambar lama

    // Jika user mengupload gambar baru, simpan gambar baru tersebut
    if (data.imageBase64) {
      imagePath = await saveImageLocally(data.imageBase64, postLama.slug);

      // Opsional: Hapus gambar lama dari hardisk server agar tidak menumpuk
      if (postLama.image) {
        const oldImagePath = path.join(process.cwd(), 'public', postLama.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    // 4. Update data di database
    await prisma.post.update({
      where: { id },
      data: {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        image: imagePath,
        // Reset kategori lama (kosongkan), lalu pasang kategori yang baru dipilih
        kategoris: {
          set: [],
          connect: data.kategoriIds.map((id) => ({ id }))
        }
      },
    });

    // 5. Refresh halaman tabel blog
    revalidatePath("/dashboard/blog");
    return { success: true, message: "Blog berhasil diperbarui." };
  } catch (error) {
    console.error("Error Update Blog:", error);
    return { success: false, message: "Gagal memperbarui postingan." };
  }
}

// C. ACTION TAMBAH VIEWS
// (Akan dipanggil di halaman publik saat pengunjung membaca blog)
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
    // 1. Cari postingan untuk mendapatkan path gambar
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return { success: false, message: "Postingan tidak ditemukan." };
    }

    // 2. Hapus gambar dari filesystem jika ada
    if (post.image) {
      const imagePath = path.join(process.cwd(), 'public', post.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // 3. Hapus dari database
    await prisma.post.delete({ where: { id } });

    // 4. Refresh halaman tabel blog
    revalidatePath("/dashboard/blog");
    return { success: true, message: "Blog berhasil dihapus." };
  } catch (error) {
    console.error("Error Delete Blog:", error);
    return { success: false, message: "Gagal menghapus postingan." };
  }
}