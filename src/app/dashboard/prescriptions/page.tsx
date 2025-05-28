"use client";

import { useState } from "react";
import Link from "next/link";

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
  const [prescriptions] = useState(sampleData);

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Prescriptions</h1>
        <Link
          href="/prescriptions/new"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md"
        >
          + New Prescription
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            {prescriptions.map((rx) => (
              <tr key={rx.id} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-4 py-2 font-medium">{rx.id}</td>
                <td className="px-4 py-2">{rx.customer}</td>
                <td className="px-4 py-2">{rx.date}</td>
                <td className="px-4 py-2">{rx.total.toLocaleString()} đ</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                      rx.status === "Confirmed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {rx.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <Link
                    href={`/prescriptions/${rx.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrescriptionsPage;
