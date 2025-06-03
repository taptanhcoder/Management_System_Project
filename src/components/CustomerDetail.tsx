// src/components/CustomerDetail.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteCustomerButton from "@/components/DeleteCustomerButton";

interface InvoiceSummary {
  id: string;
  date: Date;
  total: number;
}

interface CustomerDetailProps {
  params: {
    id: string;
  };
}

export default async function CustomerDetail({
  params,
}: CustomerDetailProps) {
  const { id } = params;

  // Lấy khách hàng + tất cả hóa đơn (chỉ cần id, date, total)
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      invoices: {
        orderBy: { date: "desc" },
        select: {
          id: true,
          date: true,
          total: true,
        },
      },
    },
  });

  if (!customer) {
    return (
      <div className="px-6 py-8 text-red-400">
        Customer with ID {id} not found.
      </div>
    );
  }

  // Helper: format ngày sang DD/MM/YYYY
  function formatDate(date: Date) {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  }

  // Helper: format tiền tệ USD
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
        <Link href="/dashboard/customers" className="hover:underline">
          Customers
        </Link>{" "}
        &gt; {customer.name}
      </div>

      {/* Tiêu đề + Edit/Delete */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Customer Detail</h1>
        <div className="flex space-x-2">
          <Link
            href={`/dashboard/customers/${id}/edit`}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Edit
          </Link>
          <DeleteCustomerButton customerId={id} />
        </div>
      </div>

      {/* Thông tin cơ bản của khách hàng */}
      <div className="bg-gray-800 rounded-md p-6 mb-8 text-gray-100">
        <p>
          <strong>Name:</strong> {customer.name}
        </p>
        <p>
          <strong>Phone:</strong> {customer.phone}
        </p>
        <p>
          <strong>Email:</strong> {customer.email}
        </p>
        <p>
          <strong>Address:</strong> {customer.address}
        </p>
        {customer.notes && (
          <p>
            <strong>Notes:</strong> {customer.notes}
          </p>
        )}
      </div>

      {/* Purchase History (chỉ hiển thị ID, Ngày, Tổng) */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-4">
          Purchase History
        </h2>

        {customer.invoices.length === 0 ? (
          <p className="text-gray-400">No purchase history.</p>
        ) : (
          <div className="overflow-x-auto bg-gray-800 rounded-md">
            <table className="w-full table-auto border-collapse text-gray-100">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-4 py-3 text-left">Invoice ID</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Total</th>
                  {/* Bỏ cột Actions */}
                </tr>
              </thead>
              <tbody>
                {customer.invoices.map((inv: InvoiceSummary) => (
                  <tr
                    key={inv.id}
                    className="border-b border-gray-700 hover:bg-gray-800"
                  >
                    <td className="px-4 py-3">{inv.id}</td>
                    <td className="px-4 py-3">{formatDate(inv.date)}</td>
                    <td className="px-4 py-3">{formatCurrency(inv.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
