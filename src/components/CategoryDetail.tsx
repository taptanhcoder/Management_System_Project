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
  const router = useRouter();

  useEffect(() => {
    async function fetchCategory() {
      // TODO: GET /api/catalog/categories/{id}
      const mockCat: Category = {
        id,
        name: "Analgesics",
        description: "Pain relievers",
      };
      setCategory(mockCat);
      // TODO: GET /api/catalog/categories/{id}/drugs
      const mockDrugs: Drug[] = [
        { id: "DRG001", name: "Paracetamol 500mg", quantity: 120, price: 5 },
        { id: "DRG003", name: "Aspirin 100mg", quantity: 80, price: 3 },
      ];
      setDrugs(mockDrugs);
    }
    fetchCategory();
  }, [id]);

  const handleDeleteCategory = () => {
    if (confirm(`Delete category ${id}?`)) {
      // TODO: DELETE /api/catalog/categories/{id}
      alert(`Deleted category ${id} (demo)`);
      router.push("/dashboard/catalog");
    }
  };

  if (!category) {
    return <p className="p-6">Loading category...</p>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400">
        <ol className="flex space-x-2 list-reset">
          <li>
            <Link href="/dashboard/catalog" legacyBehavior>
              <a className="hover:underline">Categories</a>
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
          <Link href={`/dashboard/catalog/${id}/edit`} legacyBehavior>
            <a className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md">
              Edit
            </a>
          </Link>
          <button
            onClick={handleDeleteCategory}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md"
          >
            Delete
          </button>
          <Link href={`/dashboard/catalog/${id}/new-drug`} legacyBehavior>
            <a className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md">
              + Add Drug
            </a>
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
                    <Link href={`/dashboard/catalog/${id}/${d.id}`} legacyBehavior>
                      <a className="text-blue-600 hover:underline">View</a>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Link href="/dashboard/catalog" legacyBehavior>
        <a className="inline-block text-blue-600 hover:underline">
          &larr; Back to Categories
        </a>
      </Link>
    </div>
  );
};

export default CategoryDetail;
