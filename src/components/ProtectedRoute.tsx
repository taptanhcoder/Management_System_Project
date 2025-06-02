// src/components/ProtectedRoute.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const router = useRouter();
  const path = usePathname();

  // Những route không cần login
  const publicPaths = ["/auth/signin", "/auth/register", "/login", "/"];

  useEffect(() => {
    if (isLoading) return;
    if (!publicPaths.includes(path) && !session) {
      router.replace("/auth/signin");
    }
  }, [isLoading, session, path, router]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Nếu route thuộc publicPaths, hiển thị thẳng
  if (publicPaths.includes(path)) {
    return <>{children}</>;
  }

  // Nếu đã login, hiển thị children
  return <>{children}</>;
}
