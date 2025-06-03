// src/components/InvoiceList.tsx
import { prisma } from "@/lib/prisma";

interface InvoiceSummary {
  id: string;
  date: Date;
  total: number;
  status: "PAID" | "UNPAID";
  customer: {
    id: string;
    name: string;
  };
}

export default async function InvoiceList() {
  const invoices: InvoiceSummary[] = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: {
        select: { id: true, name: true },
      },
    },
  });

  function formatDate(date: Date) {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  return (
    <div className="px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Invoices</h1>
      <div className="overflow-x-auto bg-gray-800 rounded-md">
        <table className="w-full table-auto border-collapse text-gray-100">
          <thead>
            <tr className="bg-gray-700">
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr
                key={inv.id}
                className="border-b border-gray-700 hover:bg-gray-800"
              >
                <td className="px-4 py-3">{inv.id}</td>
                <td className="px-4 py-3">{inv.customer.name}</td>
                <td className="px-4 py-3">{formatDate(inv.date)}</td>
                <td className="px-4 py-3">{formatCurrency(inv.total)}</td>
                <td className="px-4 py-3">
                  {inv.status === "PAID" ? (
                    <span className="px-2 py-1 bg-green-500 text-white rounded-md">
                      Paid
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-red-500 text-white rounded-md">
                      Unpaid
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {invoices.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-gray-400"
                >
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
