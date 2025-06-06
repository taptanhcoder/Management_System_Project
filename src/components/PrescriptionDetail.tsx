// src/components/PrescriptionDetail.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface MedicineItem {
  name: string;
  quantity: number;
  price: number;
}

interface Prescription {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: "Pending" | "Confirmed";
  medicines: MedicineItem[];
}

interface PrescriptionDetailProps {
  id: string;
}

const PrescriptionDetail = ({ id }: PrescriptionDetailProps) => {
  const [rx, setRx] = useState<Prescription | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchPrescription() {
      // TODO: GET /api/prescriptions/{id}
      const mock: Prescription = {
        id,
        customer: "John Doe",
        date: "2025-05-25",
        total: 150,
        status: "Confirmed",
        medicines: [
          { name: "Paracetamol 500mg", quantity: 10, price: 5 },
          { name: "Vitamin C 1000mg", quantity: 5, price: 10 },
        ],
      };
      setRx(mock);
    }
    fetchPrescription();
  }, [id]);

  const handleDelete = () => {
    if (confirm(`Delete prescription ${id}?`)) {
      // TODO: DELETE /api/prescriptions/{id}
      alert(`Deleted ${id} (demo)`);
      router.push("/dashboard/prescriptions");
    }
  };

  if (!rx) {
    return <p className="p-6">Loading prescription...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400">
        <ol className="flex space-x-2 list-reset">
          <li>
            <Link href="/dashboard/prescriptions" legacyBehavior>
              <a className="hover:underline">Prescriptions</a>
            </Link>
            <span className="mx-2">&gt;</span>
          </li>
          <li className="font-semibold text-gray-900 dark:text-white">{rx.id}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Prescription Detail
        </h1>
        <div className="flex gap-2">
          <Link href={`/dashboard/prescriptions/${id}/edit`} legacyBehavior>
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

      {/* Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-2">
        <p className="text-gray-900 dark:text-white">
          <strong>Customer:</strong> {rx.customer}
        </p>
        <p className="text-gray-900 dark:text-white">
          <strong>Date:</strong>{" "}
          {new Date(rx.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
        <p className="text-gray-900 dark:text-white">
          <strong>Status:</strong>{" "}
          <span
            className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
              rx.status === "Confirmed"
                ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200"
            }`}
          >
            {rx.status}
          </span>
        </p>
        <p className="text-gray-900 dark:text-white">
          <strong>Total:</strong>{" "}
          {rx.total.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </p>
      </div>

      {/* Medicines Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Medicines
        </h2>
        <table className="min-w-full text-left text-sm text-gray-700 dark:text-gray-300 border-collapse border border-gray-300 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                Name
              </th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                Quantity
              </th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                Price per Unit
              </th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                Total Price
              </th>
            </tr>
          </thead>
          <tbody>
            {rx.medicines.map((med, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50 dark:hover:bg-gray-900 transition"
              >
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white">
                  {med.name}
                </td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white">
                  {med.quantity}
                </td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white">
                  {med.price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white">
                  {(med.price * med.quantity).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link href="/dashboard/prescriptions" legacyBehavior>
        <a className="inline-block text-blue-600 hover:underline">
          &larr; Back to Prescriptions
        </a>
      </Link>
    </div>
  );
};

export default PrescriptionDetail;
