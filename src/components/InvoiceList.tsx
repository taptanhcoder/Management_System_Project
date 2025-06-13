// src/components/InvoiceList.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface InvoiceSummary {
  id: string;
  date: string;
  total: number;
  status: "PAID" | "UNPAID";
  customer: { id: string; name: string };
}

export default function InvoiceList() {
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/invoices?page=${page}&limit=${limit}`)
      .then((r) => r.json())
      .then(({ data, meta }) => {
        setInvoices(data);
        setTotalPages(Math.ceil(meta.total / limit));
      })
      .finally(() => setLoading(false));
  }, [page]);

  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("vi-VN");
  const fmtCurr = (amt: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "USD",
    }).format(amt);

  if (loading) return <p className="p-6 text-white">Đang tải…</p>;

  return (
    <div className="px-6 py-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl text-white font-bold">Invoices</h1>
        <Link
          href="/dashboard/invoices/new"
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          + New Invoice
        </Link>
      </div>
      <div className="overflow-auto bg-gray-800 rounded">
        <table className="w-full text-gray-100">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b hover:bg-gray-800">
                <td className="p-3">
                  <Link
                    href={`/dashboard/invoices/${inv.id}`}
                    className="hover:underline"
                  >
                    {inv.id}
                  </Link>
                </td>
                <td className="p-3">{inv.customer.name}</td>
                <td className="p-3">{fmtDate(inv.date)}</td>
                <td className="p-3">{fmtCurr(inv.total)}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded ${
                      inv.status === "PAID" ? "bg-green-500" : "bg-red-500"
                    } text-white`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="p-3">
                  <Link
                    href={`/dashboard/invoices/${inv.id}/edit`}
                    className="text-blue-400 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-center text-white space-x-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-700 rounded"
        >
          Prev
        </button>
        <span>
          Page {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-700 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
