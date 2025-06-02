"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { signIn, signOut, useSession } from "next-auth/react";

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
  } | null;
  /** Gọi signIn("credentials") – có thể truyền thêm option */
  login: (email: string, password: string) => Promise<void>;
  /** Đăng xuất */
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const isAuthenticated = status === "authenticated";

  /** Đăng nhập bằng Credentials provider */
  const login = useCallback(async (email: string, password: string) => {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) throw new Error(res.error);
  }, []);

  /** Đăng xuất */
  const logout = useCallback(async () => {
    await signOut({ redirect: false });
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      isAuthenticated,
      loading,
      user: (session?.user as any) ?? null,
      login,
      logout,
    }),
    [isAuthenticated, loading, session?.user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
