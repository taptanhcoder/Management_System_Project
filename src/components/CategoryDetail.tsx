// src/components/CategoryDetail.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Drug {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface CategoryDetailProps {
  id: string;
}

const CategoryDetail = ({ id }: CategoryDetailProps) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchCategory() {
      try {
        const res = await fetch(`/api/catalog/categories/${id}`);
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Cannot fetch category");
        }
        const data = await res.json();
        setCategory({
          id: data.id,
          name: data.name,
          description: data.description,
        });
        const mapped: Drug[] = data.drugs.map((d: any) => ({
          id: d.id,
          name: d.name,
          quantity: d.quantity,
          price: d.sellingPrice,
        }));
        setDrugs(mapped);
      } catch (e: any) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCategory();
  }, [id]);

  const handleDeleteCategory = async () => {
    if (!category) return;
    if (!confirm(`Delete category "${category.name}"?`)) return;
    try {
      const res = await fetch(`/api/catalog/categories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json();
        alert(errData.error || "Cannot delete category");
      } else {
        router.push("/dashboard/catalog");
      }
    } catch (e) {
      console.error(e);
      alert("Network error. Please try again.");
    }
  };

  if (loading) {
    return <p className="p-6">Loading category...</p>;
  }
  if (error) {
    return (
      <div className="p-6 text-red-600">
        <p>Error: {error}</p>
        <Link href="/dashboard/catalog" className="text-blue-600 hover:underline">
          Back to Categories
        </Link>
      </div>
    );
  }
  if (!category) {
    return <p className="p-6">Category not found.</p>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400">
        <ol className="flex space-x-2 list-reset">
          <li>
            <Link href="/dashboard/catalog" className="hover:underline">
              Categories
            </Link>
            <span className="mx-2">&gt;</span>
          </li>
          <li className="font-semibold text-gray-900 dark:text-white">
            {category.name}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Category: {category.name}
        </h1>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/catalog/${id}/edit`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md"
          >
            Edit
          </Link>
          <button
            onClick={handleDeleteCategory}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md"
          >
            Delete
          </button>
          <Link
            href={`/dashboard/catalog/${id}/new-drug`}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md"
          >
            + Add Drug
          </Link>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 dark:text-gray-300">{category.description}</p>

      {/* Drug List Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full text-left text-sm text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 font-semibold">ID</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Quantity</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drugs.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  No drugs in this category.
                </td>
              </tr>
            ) : (
              drugs.map((d) => (
                <tr
                  key={d.id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                >
                  <td className="px-4 py-3 font-medium">{d.id}</td>
                  <td className="px-4 py-3">{d.name}</td>
                  <td className="px-4 py-3">{d.quantity}</td>
                  <td className="px-4 py-3">
                    {d.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/catalog/${id}/${d.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Link href="/dashboard/catalog" className="inline-block text-blue-600 hover:underline">
        &larr; Back to Categories
      </Link>
    </div>
  );
};

export default CategoryDetail;
