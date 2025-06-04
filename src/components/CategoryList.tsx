// src/components/CategoryList.tsx

import Link from "next/link";
import { prisma } from "@/lib/prisma";

// Helper để format ngày thành DD/MM/YYYY
function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default async function CategoryList() {
  // Fetch danh sách category từ database
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="px-6 py-8">
      {/* Tiêu đề + nút tạo mới */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Categories</h1>
          <p className="text-gray-300">Manage product categories.</p>
        </div>
        {/* Link tới trang tạo Category (static “new”) */}
        <Link
          href="/dashboard/catalog/new"
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
        >
          + New Category
        </Link>
      </div>

      {/* Bảng hiển thị danh sách categories */}
      <div className="overflow-x-auto bg-gray-800 rounded-md">
        <table className="w-full table-auto border-collapse text-gray-100">
          <thead>
            <tr className="bg-gray-700">
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Created At</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-gray-700 hover:bg-gray-800">
                <td className="px-4 py-3">{cat.id}</td>
                <td className="px-4 py-3">{cat.name}</td>
                <td className="px-4 py-3">{cat.description}</td>
                <td className="px-4 py-3">{formatDate(cat.createdAt)}</td>
                <td className="px-4 py-3">
                  {/* Link tới detail category */}
                  <Link
                    href={`/dashboard/catalog/${cat.id}`}
                    className="text-blue-400 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
