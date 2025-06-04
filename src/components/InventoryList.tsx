// src/components/InventoryList.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import useSWR from "swr";

interface Drug {
  id: string;
  name: string;
  category: { id: string; name: string };
  quantity: number;
  expiryDate: string;
  status: "OK" | "LOW_STOCK" | "EXPIRING_SOON" | "EXPIRED" | "OUT_OF_STOCK";
}

const fetcher = (url: string) =>
  fetch(url).then(async (res) => {
    if (!res.ok) {
      throw new Error("Error fetching inventory");
    }
    return res.json();
  });

const InventoryList = () => {
  const { data, error } = useSWR<Drug[]>("/api/inventory", fetcher);
  const [searchTerm, setSearchTerm] = useState("");

  if (error) return <div className="p-6 text-red-600">Failed to load inventory</div>;
  if (!data) return <div className="p-6">Loading inventory...</div>;

  const filtered = data.filter(
    (d) =>
      d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function renderStatusLabel(status: Drug["status"]) {
    switch (status) {
      case "OK":
        return (
          <span className="px-2 py-1 text-green-800 bg-green-100 rounded text-xs">
            OK
          </span>
        );
      case "LOW_STOCK":
        return (
          <span className="px-2 py-1 text-orange-800 bg-orange-100 rounded text-xs">
            Low Stock
          </span>
        );
      case "EXPIRING_SOON":
        return (
          <span className="px-2 py-1 text-yellow-800 bg-yellow-100 rounded text-xs">
            Expiring Soon
          </span>
        );
      case "EXPIRED":
        return (
          <span className="px-2 py-1 text-gray-800 bg-gray-200 rounded text-xs">
            Expired
          </span>
        );
      case "OUT_OF_STOCK":
        return (
          <span className="px-2 py-1 text-red-800 bg-red-100 rounded text-xs">
            Out of Stock
          </span>
        );
      default:
        return null;
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Inventory
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage all drugs in stock.
          </p>
        </div>
        <Link href="/dashboard/inventory/new" legacyBehavior>
          <a className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md">
            + Add / Restock Drug
          </a>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="max-w-md relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search drugs..."
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-600"
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
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Quantity</th>
              <th className="px-4 py-3 font-semibold">Expiry Date</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  No drugs found.
                </td>
              </tr>
            ) : (
              filtered.map((drug) => (
                <tr
                  key={drug.id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                >
                  <td className="px-4 py-3 font-medium">{drug.id}</td>
                  <td className="px-4 py-3">{drug.name}</td>
                  <td className="px-4 py-3">{drug.category.name}</td>
                  <td className="px-4 py-3">{drug.quantity}</td>
                  <td className="px-4 py-3">
                    {new Date(drug.expiryDate).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-4 py-3">{renderStatusLabel(drug.status)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/inventory/${drug.id}`} legacyBehavior>
                      <a className="text-blue-600 hover:underline font-semibold">
                        View
                      </a>
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

export default InventoryList;
