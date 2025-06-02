// src/app/api/auth/[...nextauth]/route.ts

import NextAuth, { DefaultSession, DefaultUser, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

// Mở rộng kiểu để session.user có thêm id
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email?: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email và mật khẩu là bắt buộc");
        }
        // Tìm user theo email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) {
          throw new Error("Không tìm thấy user");
        }
        // So sánh password
        const isValid = await compare(credentials.password, user.passwordHash);
        if (!isValid) {
          throw new Error("Sai email hoặc mật khẩu");
        }
        // Trả về object User mà NextAuth mong đợi
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Khi authorize thành công, gán id + email vào JWT token
      if (user) {
        token.id = user.id;
        token.email = user.email ?? undefined;
      }
      return token;
    },
    async session({ session, token }) {
      // Khi NextAuth trả session, thêm id và email (nếu có) từ token
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email ?? undefined;
      }
      return session;
    },
  },
  pages: {
    // Khi NextAuth cần redirect đến trang signin, sẽ gọi đường dẫn này
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET, // Đảm bảo đã đặt trong .env.local
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
