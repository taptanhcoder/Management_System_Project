// src/components/CustomerDetail.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
}

interface CustomerDetailProps {
  id: string;
}

const CustomerDetail = ({ id }: CustomerDetailProps) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchCustomer() {
      // TODO: GET /api/customers/{id}
      const mock: Customer = {
        id,
        name: "Alice Brown",
        phone: "123-456-7890",
        email: "alice@example.com",
        address: "123 Main St",
        notes: "VIP customer",
      };
      setCustomer(mock);
    }
    fetchCustomer();
  }, [id]);

  const handleDelete = () => {
    if (confirm(`Delete customer ${id}?`)) {
      // TODO: DELETE /api/customers/{id}
      alert(`Deleted ${id} (demo)`);
      router.push("/dashboard/customers");
    }
  };

  if (!customer) {
    return <p className="p-6">Loading customer details...</p>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400">
        <ol className="flex space-x-2 list-reset">
          <li>
            <Link href="/dashboard/customers" legacyBehavior>
              <a className="hover:underline">Customers</a>
            </Link>
            <span className="mx-2">&gt;</span>
          </li>
          <li className="font-semibold text-gray-900 dark:text-white">
            {customer.id}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Customer Detail
        </h1>
        <div className="flex gap-2">
          <Link href={`/dashboard/customers/${id}/edit`} legacyBehavior>
            <a className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md">
              Edit
            </a>
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-2">
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
        <p>
          <strong>Notes:</strong> {customer.notes}
        </p>
      </div>

      <Link href="/dashboard/customers" legacyBehavior>
        <a className="inline-block text-blue-600 hover:underline">
          &larr; Back to Customers
        </a>
      </Link>
    </div>
  );
};

export default CustomerDetail;
