// src/app/api/auth/register/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);

    // Kiểm tra email đã tồn tại chưa
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      return NextResponse.json({ error: "Email đã được đăng ký" }, { status: 400 });
    }

    // Hash password rồi lưu
    const passwordHash = await hash(data.password, 10);
    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash,
        role: "USER",        // Mặc định USER
      },
    });

    // Trả về thông tin user (không bao gồm passwordHash)
    return NextResponse.json(
      { id: newUser.id, email: newUser.email, name: newUser.name },
      { status: 201 }
    );
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Không thể đăng ký user" }, { status: 500 });
  }
}
