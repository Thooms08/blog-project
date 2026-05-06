import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, username, email, password } = await req.json();

    // 1. Cek apakah user/email sudah ada
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email atau Username sudah terdaftar" }, { status: 400 });
    }

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Simpan ke Database
    const user = await prisma.user.create({
      data: { name, username, email, password: hashedPassword },
    });

    return NextResponse.json({ message: "User berhasil dibuat", user: { id: user.id } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}