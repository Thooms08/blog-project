"use server";

import prisma from '@/lib/prisma';
import { headers } from 'next/headers';

export async function getUlasans() {
  try {
    const ulasans = await prisma.ulasan.findMany({
      include: {
        post: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    return { success: true, data: ulasans };
  } catch (error) {
    console.error("Error fetching ulasans:", error);
    return { success: false, error: "Gagal mengambil data ulasan." };
  }
}

export async function submitUlasanAction(data: {
  postId: number;
  rating: number;
  comment?: string;
}) {
  try {
    // 1. Validasi Rating (Wajib 1-5)
    if (!data.rating || data.rating < 1 || data.rating > 5) {
      return { success: false, error: "Rating wajib diisi (1 - 5 Bintang)." };
    }

    // 2. Sanitasi Sederhana (Hapus whitespace berlebih jika ada)
    const cleanComment = data.comment ? data.comment.trim() : undefined;

    // 3. Ambil data keamanan (IP Address & User Agent)
    const headersList = headers();
    const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'Unknown';
    const userAgent = headersList.get('user-agent') || 'Unknown';

    // 4. Simpan ke database
    await prisma.ulasan.create({
      data: {
        post_id: data.postId,
        rating: data.rating,
        comment: cleanComment !== "" ? cleanComment : null,
        ip_address: ipAddress,
        user_agent: userAgent,
      }
    });

    return { success: true, message: "Terima kasih! Ulasan Anda telah terkirim kepada penulis." };
  } catch (error) {
    console.error("Error submit ulasan:", error);
    return { success: false, error: "Gagal mengirim ulasan. Silakan coba lagi." };
  }
}