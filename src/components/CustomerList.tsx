// src/components/ui/CustomerList.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string | null;
  createdAt: Date;
}

/**
 * Server Component: Lấy danh sách customer từ Prisma, có thể filter theo searchQuery
 */
export default async function CustomerList({
  searchQuery,
}: {
  searchQuery?: string;
}) {
  // Chuyển searchQuery về lowercase để filter
  const q = searchQuery?.toLowerCase() || "";

  // Truy vấn database với điều kiện tìm kiếm
  const customers: Customer[] = await prisma.customer.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { phone: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="px-6 py-8">
      {/* Tiêu đề + nút thêm */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Customers</h1>
          <p className="text-gray-300">Manage customer data.</p>
        </div>
        <Link
          href="/dashboard/customers/new"
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
        >
          + New Customer
        </Link>
      </div>

      {/* Search bar (Server Component chỉ render giao diện; form action sẽ truyền param về page) */}
      <form action="/dashboard/customers" className="mb-4">
        <input
          type="text"
          name="q"
          defaultValue={searchQuery || ""}
          placeholder="Search customers..."
          className="w-full px-4 py-2 bg-gray-800 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>

      {/* Bảng hiển thị */}
      <div className="overflow-x-auto bg-gray-800 rounded-md">
        <table className="w-full table-auto border-collapse text-gray-100">
          <thead>
            <tr className="bg-gray-700">
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Address</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cus) => (
              <tr
                key={cus.id}
                className="border-b border-gray-700 hover:bg-gray-800"
              >
                <td className="px-4 py-3">{cus.id}</td>
                <td className="px-4 py-3">{cus.name}</td>
                <td className="px-4 py-3">{cus.phone}</td>
                <td className="px-4 py-3">{cus.email}</td>
                <td className="px-4 py-3">{cus.address}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/customers/${cus.id}`}
                    className="text-blue-400 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}

            {customers.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-gray-400"
                >
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
