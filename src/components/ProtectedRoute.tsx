// src/components/ProtectedRoute.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useRouter, usePathname } from "next/navigation";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    // Nếu route bắt đầu bằng /dashboard mà chưa login, redirect về /login
    if (path.startsWith("/dashboard") && !isAuthenticated) {
      router.push("/login");
    }
  }, [path, isAuthenticated, router]);

  // Cho phép truy cập các route công cộng (login, register)
  if (path === "/login" || path === "/register") {
    return <>{children}</>;
  }

  return <>{children}</>;
}