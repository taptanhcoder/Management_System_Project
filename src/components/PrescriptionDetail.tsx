// src/components/PrescriptionDetail.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DrugOption {
  id: string;
  name: string;
}

interface PrescriptionItemRaw {
  id: string;
  drugId: string;
  quantity: number;
  unitPrice: number;
}

interface PrescriptionRaw {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: "PENDING" | "CONFIRMED";
  items: PrescriptionItemRaw[];
}

interface PrescriptionDetailProps {
  id: string;
}

export default function PrescriptionDetail({ id }: PrescriptionDetailProps) {
  const [pres, setPres] = useState<PrescriptionRaw | null>(null);
  const [drugOptions, setDrugOptions] = useState<DrugOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Load drug list for name lookup
  useEffect(() => {
    async function loadDrugs() {
      try {
        const res = await fetch("/api/inventory");
        if (!res.ok) throw new Error(`Error fetching drugs: ${res.status}`);
        const list: any[] = await res.json();
        setDrugOptions(list.map(d => ({ id: d.id, name: d.name })));
      } catch (e: any) {
        console.error(e);
        setError("Failed to load drug list.");
      }
    }
    loadDrugs();
  }, []);

  // Load prescription detail
  useEffect(() => {
    async function fetchPrescription() {
      try {
        const res = await fetch(`/api/prescriptions/${id}`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data: PrescriptionRaw = await res.json();
        setPres(data);
      } catch (e: any) {
        console.error(e);
        setError("Failed to load prescription.");
      } finally {
        setLoading(false);
      }
    }
    fetchPrescription();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm(`Delete prescription ${id}?`)) return;
    try {
      const res = await fetch(`/api/prescriptions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      router.push("/dashboard/prescriptions");
    } catch (e: any) {
      console.error(e);
      alert("Failed to delete prescription.");
    }
  };

  if (loading) return <p className="p-6">Loading prescription...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!pres) return <p className="p-6 text-red-600">Prescription not found</p>;

  // Map raw items to display items
  const medicines = pres.items.map(it => {
    const drug = drugOptions.find(d => d.id === it.drugId);
    return {
      name: drug ? drug.name : it.drugId,
      quantity: it.quantity,
      price: it.unitPrice,
    };
  });

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400">
        <ol className="flex space-x-2 list-reset">
          <li>
            <Link href="/dashboard/prescriptions" className="hover:underline">
              Prescriptions
            </Link>
            <span className="mx-2">&gt;</span>
          </li>
          <li className="font-semibold text-gray-900 dark:text-white">{pres.id}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Prescription Detail
        </h1>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/prescriptions/${id}/edit`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md"
          >
            Edit
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
          <strong>Customer:</strong> {pres.customer}
        </p>
        <p className="text-gray-900 dark:text-white">
          <strong>Date:</strong>{" "}
          {new Date(pres.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
        <p className="text-gray-900 dark:text-white">
          <strong>Status:</strong>{" "}
          <span
            className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
              pres.status === "CONFIRMED"
                ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200"
            }`}
          >
            {pres.status.charAt(0) + pres.status.slice(1).toLowerCase()}
          </span>
        </p>
        <p className="text-gray-900 dark:text-white">
          <strong>Total:</strong>{" "}
          {pres.total.toLocaleString("en-US", {
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
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">Name</th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">Quantity</th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">Price per Unit</th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((med, idx) => (
              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition">
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white">{med.name}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white">{med.quantity}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white">{med.price.toLocaleString("en-US", { style: "currency", currency: "USD" })}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white">{(med.price * med.quantity).toLocaleString("en-US", { style: "currency", currency: "USD" })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link href="/dashboard/prescriptions" className="inline-block text-blue-600 hover:underline">
        &larr; Back to Prescriptions
      </Link>
    </div>
  );
}
