// src/components/InvoiceDetail.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";

interface InvoiceDetailProps {
  params: { id: string };
}

export default async function InvoiceDetail({ params }: InvoiceDetailProps) {
  const { id } = params;

  // Lấy chi tiết hóa đơn + customer.name + items.drug.name
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      customer: {
        select: { id: true, name: true },
      },
      items: {
        select: {
          id: true,
          quantity: true,
          unitPrice: true,
          drug: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!invoice) {
    return (
      <div className="px-6 py-8 text-red-400">
        Invoice with ID {id} not found.
      </div>
    );
  }

  // Helper format date DD/MM/YYYY
  function formatDate(date: Date) {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  }

  // Helper format currency USD
  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  return (
    <div className="px-6 py-8">
      {/* Breadcrumb */}
      <div className="text-gray-400 mb-4">
        <Link href="/dashboard/invoices" className="hover:underline">
          Invoices
        </Link>{" "}
        &gt; {invoice.id}
      </div>

      {/* Tiêu đề + Edit/Delete */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Invoice Detail</h1>
        <div className="space-x-2">
          <Link
            href={`/dashboard/invoices/${id}/edit`}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Edit
          </Link>
          <button
            onClick={async () => {
              if (!confirm("Delete this invoice?")) return;
              await fetch(`/api/invoices/${id}`, { method: "DELETE" });
              window.location.href = "/dashboard/invoices";
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Thông tin cơ bản */}
      <div className="bg-gray-800 rounded-md p-6 mb-8 text-gray-100">
        <p>
          <strong>ID:</strong> {invoice.id}
        </p>
        <p>
          <strong>Customer:</strong>{" "}
          <Link
            href={`/dashboard/customers/${invoice.customer.id}`}
            className="text-blue-400 hover:underline"
          >
            {invoice.customer.name}
          </Link>
        </p>
        <p>
          <strong>Date:</strong> {formatDate(invoice.date)}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          {invoice.status === "PAID" ? (
            <span className="px-2 py-1 bg-green-500 text-white rounded-md">
              Paid
            </span>
          ) : (
            <span className="px-2 py-1 bg-red-500 text-white rounded-md">
              Unpaid
            </span>
          )}
        </p>
        <p>
          <strong>Total:</strong> {formatCurrency(invoice.total)}
        </p>
      </div>

      {/* Danh sách items */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-4">Items</h2>
        <div className="overflow-x-auto bg-gray-800 rounded-md">
          <table className="w-full table-auto border-collapse text-gray-100">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-4 py-3 text-left">Drug</th>
                <th className="px-4 py-3 text-left">Quantity</th>
                <th className="px-4 py-3 text-left">Unit Price</th>
                <th className="px-4 py-3 text-left">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((it) => (
                <tr
                  key={it.id}
                  className="border-b border-gray-700 hover:bg-gray-800"
                >
                  <td className="px-4 py-3">{it.drug.name}</td>
                  <td className="px-4 py-3">{it.quantity}</td>
                  <td className="px-4 py-3">{formatCurrency(it.unitPrice)}</td>
                  <td className="px-4 py-3">
                    {formatCurrency(it.quantity * it.unitPrice)}
                  </td>
                </tr>
              ))}
              {invoice.items.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-gray-400"
                  >
                    No items.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
