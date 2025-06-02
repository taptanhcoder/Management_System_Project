"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

type Prescription = {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: "Pending" | "Confirmed";
};

const sampleData: Prescription[] = [
  {
    id: "RX001",
    customer: "Nguyễn Văn A",
    date: "2025-05-25",
    total: 150000,
    status: "Pending",
  },
  {
    id: "RX002",
    customer: "Trần Thị B",
    date: "2025-05-26",
    total: 320000,
    status: "Confirmed",
  },
];

const PrescriptionsPage = () => {
  // Dữ liệu có thể thay bằng fetch API sau này
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(sampleData);
  const [searchTerm, setSearchTerm] = useState("");

  // Lọc dữ liệu theo search term
  const filteredPrescriptions = prescriptions.filter((rx) =>
    rx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rx.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Prescriptions &gt; <span className="font-semibold text-gray-900 dark:text-white">List of Prescriptions ({filteredPrescriptions.length})</span>
      </div>

      {/* Title and Add New */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">List of Prescriptions</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">List of prescriptions available for sales.</p>
        </div>
        <Link
          href="/dashboard/prescriptions/new"
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md transition"
        >
          + Add New Prescription
        </Link>
      </div>

      {/* Search bar */}
      <div className="max-w-md relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search prescriptions..."
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full text-left text-sm text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 font-semibold cursor-pointer">ID</th>
              <th className="px-4 py-3 font-semibold cursor-pointer">Customer</th>
              <th className="px-4 py-3 font-semibold cursor-pointer">Date</th>
              <th className="px-4 py-3 font-semibold cursor-pointer">Total</th>
              <th className="px-4 py-3 font-semibold cursor-pointer">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrescriptions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                  No prescriptions found.
                </td>
              </tr>
            ) : (
              filteredPrescriptions.map((rx) => (
                <tr
                  key={rx.id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                >
                  <td className="px-4 py-3 font-medium">{rx.id}</td>
                  <td className="px-4 py-3">{rx.customer}</td>
                  <td className="px-4 py-3">{new Date(rx.date).toLocaleDateString("vi-VN")}</td>
                  <td className="px-4 py-3">{rx.total.toLocaleString("vi-VN")} đ</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        rx.status === "Confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {rx.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/prescriptions/${rx.id}`} className="text-red-600 hover:underline font-semibold">
                      View Details →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="text-gray-500 dark:text-gray-400 text-sm mt-2 flex justify-between items-center">
        <div>Showing 1 - {filteredPrescriptions.length} results</div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-200 dark:border-gray-700 dark:hover:bg-gray-700 transition">
            Previous
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-200 dark:border-gray-700 dark:hover:bg-gray-700 transition">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionsPage;
