// src/app/dashboard/layout.tsx
"use client";

import { useState, useEffect, ReactNode } from "react";
import classNames from "classnames";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/AuthContext";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  /** Lấy trạng thái dark hiện thời trên <html>, tránh lệch màu khi reload */
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });

  const [collapsed, setCollapsed] = useState(false);
  const { logout, user } = useAuth();

  /** Mỗi lần darkMode đổi → thêm / gỡ class "dark" cho <html> */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="h-screen overflow-hidden flex">
      {/* ──────────── SIDEBAR ──────────── */}
      <aside
        className={classNames(
          "transition-all duration-300 border-r shadow-md overflow-y-auto",
          // dùng Tailwind variant => sidebar khớp theme chung
          "bg-white text-black dark:bg-gray-800 dark:text-white",
          collapsed ? "w-16" : "w-60"
        )}
      >
        <div className="p-4 flex flex-col items-center lg:items-start">
          {/* Nút thu gọn & nút switch theme */}
          <div className="flex items-center justify-between w-full mb-6">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white focus:outline-none"
            >
              {collapsed ? "▶" : "◀"}
            </button>

            {!collapsed && (
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white ml-auto focus:outline-none"
              >
                {darkMode ? "🌙" : "☀️"}
              </button>
            )}
          </div>

          {/* Logo */}
          <Link href="/dashboard/admin" legacyBehavior>
            <a className="flex items-center gap-2 mb-8">
              <Image src="/logo.png" alt="logo" width={32} height={32} />
              {!collapsed && (
                <span className="text-xl font-bold">PharmaOne</span>
              )}
            </a>
          </Link>

          {/* Menu */}
          <Menu collapsed={collapsed} />
        </div>
      </aside>

      {/* ──────────── MAIN CONTENT ──────────── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar onLogout={logout} userName={user?.email || "User"} />

        {/* Content */}
        <section className="flex-1 overflow-y-auto p-6 bg-gray-100 dark:bg-gray-900">
          {children}
        </section>
      </main>
    </div>
  );
}
