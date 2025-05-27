"use client";

import { useState, useEffect } from "react";
import classNames from "classnames";
import Link from "next/link";
import Image from "next/image";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode class trên <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className={classNames("h-screen overflow-hidden flex", darkMode ? "bg-gray-900" : "bg-[#F7F8FA]")}>
      {/* SIDEBAR */}
      <aside
        className={classNames(
          "transition-all duration-300 border-r shadow-md overflow-y-auto",
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black",
          collapsed ? "w-[5%]" : "w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%]"
        )}
      >
        <div className="p-4 flex flex-col items-center lg:items-start">
          {/* Toggle + Dark Mode Buttons */}
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
          <Link
            href="/"
            className="flex items-center justify-center lg:justify-start gap-2"
          >
            <Image src="/logo.png" alt="logo" width={32} height={32} />
            {!collapsed && (
              <span className="hidden lg:block font-bold">xxx</span>
            )}
          </Link>

          {/* Menu Component */}
          <Menu collapsed={collapsed} />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <nav className={classNames("shadow-sm z-10", darkMode ? "bg-gray-800 text-white" : "bg-white text-black")}>
          <Navbar />
        </nav>
        <section className={classNames("flex-1 overflow-y-auto px-4 py-2", darkMode ? "bg-gray-900 text-white" : "text-black")}>
          {children}
        </section>
      </main>
    </div>
  );
}
