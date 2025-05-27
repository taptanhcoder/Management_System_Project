// src/app/dashboard/layout.tsx

"use client";

import { useState, useEffect, ReactNode } from "react";
import classNames from "classnames";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="h-screen overflow-hidden flex">
      {/* SIDEBAR */}
      <aside
        className={classNames(
          "transition-all duration-300 border-r shadow-md overflow-y-auto",
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black",
          collapsed ? "w-[60px]" : "w-[250px]"
        )}
      >
        <div className="p-4 flex flex-col items-center lg:items-start">
          {/* Toggle + Dark Mode */}
          <div className="flex items-center justify-between w-full mb-4">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-sm text-gray-500 hover:text-black dark:hover:text-white"
            >
              {collapsed ? "▶" : "◀"}
            </button>
            {!collapsed && (
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="text-sm text-gray-500 hover:text-black dark:hover:text-white ml-auto"
              >
                {darkMode ? "🌙" : "☀️"}
              </button>
            )}
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="logo" width={32} height={32} />
            {!collapsed && <span className="hidden lg:block font-bold">Pharma One</span>}
          </Link>

          {/* Menu */}
          <Menu collapsed={collapsed} />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <nav className="shadow-sm z-10">
          <Navbar />
        </nav>
        <section className="flex-1 overflow-y-auto p-6 bg-[#f5f7fa] dark:bg-gray-900">
          {children}
        </section>
      </main>
    </div>
  );
}
