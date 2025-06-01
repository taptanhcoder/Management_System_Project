// src/components/CustomerList.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
}

const CustomerList = () => {
  // TODO: GET /api/customers
  const sample: Customer[] = [
    {
      id: "CUS001",
      name: "Alice Brown",
      phone: "123-456-7890",
      email: "alice@example.com",
      address: "123 Main St",
    },
    {
      id: "CUS002",
      name: "Bob Smith",
      phone: "987-654-3210",
      email: "bob@example.com",
      address: "456 Oak Ave",
    },
  ];

  const [customers, setCustomers] = useState<Customer[]>(sample);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = customers.filter((c) =>
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Customers
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage customer data.
          </p>
        </div>
        <Link href="/dashboard/customers/new" legacyBehavior>
          <a className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md">
            + New Customer
          </a>
        </Link>
      </div>

      {/* Search */}
      <div className="max-w-md relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search customers..."
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
              <th className="px-4 py-3 font-semibold">Phone</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Address</th>
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
                  No customers found.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                >
                  <td className="px-4 py-3 font-medium">{c.id}</td>
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">{c.phone}</td>
                  <td className="px-4 py-3">{c.email}</td>
                  <td className="px-4 py-3">{c.address}</td>
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/customers/${c.id}`} legacyBehavior>
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

export default CustomerList;
