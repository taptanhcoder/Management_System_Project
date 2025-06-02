// src/app/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import AuthWrapper from "@/components/AuthWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PharmaOne Management System",
  description: "Frontend for pharmacy management",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900`}>
        {/* Bọc AuthWrapper (Client Component) */}
        <AuthWrapper>{children}</AuthWrapper>
      </body>
    </html>
  );
}
