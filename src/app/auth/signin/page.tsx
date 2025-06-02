// src/app/auth/signin/page.tsx
"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);
    if (res?.error) {
      setError(res.error);
    } else {
      router.replace("/dashboard/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-700 px-8 py-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Sign In
        </h2>
        {error && <p className="text-red-600 mb-2 text-sm">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 text-sm mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-white"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-200 text-sm mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="********"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-white"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition"
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link href="/auth/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
