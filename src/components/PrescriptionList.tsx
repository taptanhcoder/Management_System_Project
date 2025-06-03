// src/components/PrescriptionList.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";

// Helper để format ngày (DD/MM/YYYY)
function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Helper để format tiền tệ (USD) — bạn có thể đổi locale / currency nếu cần
function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Đây là một Server Component (mặc định Next.js 13+)
 * Khi page.tsx render <PrescriptionList />, phần code này sẽ chạy ở phía server,
 * gọi Prisma để lấy toàn bộ đơn thuốc (prescriptions) và render thành một bảng.
 */
export default async function PrescriptionList() {
  // 1. Tải dữ liệu prescriptions từ database, sắp xếp theo ngày (mới nhất trước)
  const prescriptions = await prisma.prescription.findMany({
    orderBy: { date: "desc" },
  });

  return (
    <div className="px-6 py-8">
      {/* Tiêu đề và nút New Prescription */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Prescriptions</h1>
          <p className="text-gray-300">Manage patient prescriptions.</p>
        </div>
        <Link
          href="/dashboard/prescriptions/new"
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
        >
          + New Prescription
        </Link>
      </div>

      {/* Search bar (giả lập, chỉ thanh đồ họa, bạn có thể bổ sung logic tìm kiếm nếu muốn) */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search prescriptions..."
          className="w-full px-4 py-2 bg-gray-800 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Bảng hiển thị danh sách prescriptions */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse text-gray-100">
          <thead>
            <tr className="bg-gray-700">
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((pres) => (
              <tr
                key={pres.id}
                className="border-b border-gray-700 hover:bg-gray-800"
              >
                {/* ID */}
                <td className="px-4 py-3">{pres.id}</td>

                {/* Customer */}
                <td className="px-4 py-3">{pres.customer}</td>

                {/* Date */}
                <td className="px-4 py-3">{formatDate(pres.date)}</td>

                {/* Total */}
                <td className="px-4 py-3">{formatCurrency(pres.total)}</td>

                {/* Status */}
                <td className="px-4 py-3">
                  {pres.status === "PENDING" ? (
                    <span className="px-2 py-1 bg-yellow-500 text-white rounded-md">
                      Pending
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-green-500 text-white rounded-md">
                      Confirmed
                    </span>
                  )}
                </td>

                {/* Actions: link “View” (bạn có thể chỉnh lại đường dẫn tùy file detail) */}
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/prescriptions/${pres.id}`}
                    className="text-blue-400 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}

            {/* Nếu chưa có đơn nào */}
            {prescriptions.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-gray-400"
                >
                  No prescriptions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
