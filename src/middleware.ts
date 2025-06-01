// src/middleware.ts

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Chỉ áp dụng bảo vệ cho đường dẫn bắt đầu bằng /dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      // Nếu chưa login, chuyển hướng về trang signin
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
