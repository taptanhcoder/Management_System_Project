// src/components/AuthWrapper.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import ProtectedRoute from "./ProtectedRoute";

type AuthWrapperProps = {
  children: ReactNode;
};

export default function AuthWrapper({ children }: AuthWrapperProps) {
  return (
    // SessionProvider phải nằm trong Client Component
    <SessionProvider>
      <ProtectedRoute>{children}</ProtectedRoute>
    </SessionProvider>
  );
}
