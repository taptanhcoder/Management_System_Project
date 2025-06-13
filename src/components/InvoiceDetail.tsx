// src/components/InvoiceDetail.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Item {
  id: string;
  quantity: number;
  unitPrice: number;
  drug: { id: string; name: string };
}
interface Detail {
  id: string;
  date: string;
  status: "PAID" | "UNPAID";
  total: number;
  customer: { id: string; name: string };
  items: Item[];
}

export default function InvoiceDetail({ id }: { id: string }) {
  const [inv, setInv] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/invoices/${id}`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setInv(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("vi-VN");
  const fmtCurr = (a: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "USD",
    }).format(a);

  const handlePay = async () => {
    if (!inv || inv.status === "PAID") return;
    await fetch(`/api/invoices/${id}/pay`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prescriptionId: undefined }),
    });
    router.refresh();
  };

  if (loading) return <p className="p-6 text-white">Loading...</p>;
  if (error) return <p className="p-6 text-red-400">{error}</p>;
  if (!inv) return <p className="p-6 text-red-400">Not found</p>;

  return (
    <div className="p-6 text-white space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl">Invoice {inv.id}</h1>
        <div className="space-x-2">
          <Link
            href={`/dashboard/invoices/${id}/edit`}
            className="px-4 py-2 bg-blue-500 rounded"
          >
            Edit
          </Link>
          {inv.status === "UNPAID" && (
            <button
              onClick={handlePay}
              className="px-4 py-2 bg-green-600 rounded"
            >
              Confirm Payment
            </button>
          )}
        </div>
      </div>

      <p>Customer: {inv.customer.name}</p>
      <p>Date: {fmtDate(inv.date)}</p>
      <p>Status: {inv.status}</p>
      <p>Total: {fmtCurr(inv.total)}</p>

      <table className="w-full mt-4 text-gray-100">
        <thead className="bg-gray-700">
          <tr>
            <th className="p-2">Drug</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Unit</th>
            <th className="p-2">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {inv.items.map((it) => (
            <tr key={it.id} className="border-b">
              <td className="p-2">{it.drug.name}</td>
              <td className="p-2">{it.quantity}</td>
              <td className="p-2">{fmtCurr(it.unitPrice)}</td>
              <td className="p-2">
                {fmtCurr(it.quantity * it.unitPrice)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
