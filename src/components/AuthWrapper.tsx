"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { AuthProvider } from "@/components/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AuthWrapper({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <ProtectedRoute>{children}</ProtectedRoute>
      </AuthProvider>
    </SessionProvider>
  );
}
