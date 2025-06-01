// src/components/PrescriptionList.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

interface Prescription {
  id: string;
  customer: string;
  date: string; // YYYY-MM-DD
  total: number;
  status: "Pending" | "Confirmed";
}

const PrescriptionList = () => {
  // TODO: fetch GET /api/prescriptions
  const sample: Prescription[] = [
    {
      id: "RX001",
      customer: "John Doe",
      date: "2025-05-25",
      total: 150,
      status: "Pending",
    },
    {
      id: "RX002",
      customer: "Jane Smith",
      date: "2025-05-26",
      total: 320,
      status: "Confirmed",
    },
  ];

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(sample);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = prescriptions.filter(
    (rx) =>
      rx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Prescriptions
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage patient prescriptions.
          </p>
        </div>
        <Link href="/dashboard/prescriptions/new" legacyBehavior>
          <a className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md">
            + New Prescription
          </a>
        </Link>
      </div>

      {/* Search */}
      <div className="max-w-md relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search prescriptions..."
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
        />
        <Search
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full text-left text-sm text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 font-semibold">ID</th>
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Total</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  No prescriptions found.
                </td>
              </tr>
            ) : (
              filtered.map((rx) => (
                <tr
                  key={rx.id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                >
                  <td className="px-4 py-3 font-medium">{rx.id}</td>
                  <td className="px-4 py-3">{rx.customer}</td>
                  <td className="px-4 py-3">
                    {new Date(rx.date).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-4 py-3">
                    {rx.total.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
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
                    <Link href={`/dashboard/prescriptions/${rx.id}`} legacyBehavior>
                      <a className="text-blue-600 hover:underline">View</a>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrescriptionList;
