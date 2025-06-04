// src/components/InventoryDetail.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";

interface Drug {
  id: string;
  name: string;
  category: { id: string; name: string };
  quantity: number;
  expiryDate: string;
  supplier: string;
  purchasePrice: number;
  sellingPrice: number;
  description: string;
  status: "OK" | "LOW_STOCK" | "EXPIRING_SOON" | "EXPIRED" | "OUT_OF_STOCK";
}

interface InventoryDetailProps {
  id: string;
}

const InventoryDetail = ({ id }: InventoryDetailProps) => {
  const [drug, setDrug] = useState<Drug | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchDrug() {
      try {
        const res = await fetch(`/api/inventory/${id}`);
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Cannot fetch drug");
        }
        const data: Drug = await res.json();
        setDrug(data);
      } catch (e: any) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDrug();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm(`Delete drug ${id}?`)) return;
    try {
      const res = await fetch(`/api/inventory/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Cannot delete");
      } else {
        alert(`Deleted ${id}`);
        router.push("/dashboard/inventory");
      }
    } catch (e) {
      console.error(e);
      alert("Error deleting drug");
    }
  };

  if (loading) {
    return <p className="p-6">Loading drug details...</p>;
  }
  if (error) {
    return <p className="p-6 text-red-600">Error: {error}</p>;
  }
  if (!drug) {
    return <p className="p-6">Drug not found.</p>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400">
        <ol className="flex space-x-2 list-reset">
          <li>
            <Link href="/dashboard/inventory" legacyBehavior>
              <a className="hover:underline">Inventory</a>
            </Link>
            <span className="mx-2">&gt;</span>
          </li>
          <li className="font-semibold text-gray-900 dark:text-white">{drug.id}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Drug Details
        </h1>
        <div className="flex gap-2">
          <Link href={`/dashboard/inventory/${id}/edit`} legacyBehavior>
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
          <strong>Name:</strong> {drug.name}
        </p>
        <p>
          <strong>Category:</strong> {drug.category.name}
        </p>
        <p>
          <strong>Quantity:</strong> {drug.quantity}
        </p>
        <p>
          <strong>Expiry Date:</strong>{" "}
          {format(new Date(drug.expiryDate), "dd/MM/yyyy")}
        </p>
        <p>
          <strong>Supplier:</strong> {drug.supplier}
        </p>
        <p>
          <strong>Purchase Price:</strong>{" "}
          {drug.purchasePrice.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </p>
        <p>
          <strong>Selling Price:</strong>{" "}
          {drug.sellingPrice.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </p>
        <p>
          <strong>Description:</strong> {drug.description}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            {drug.status.replace("_", " ")}
          </span>
        </p>
      </div>

      {/* Back link */}
      <Link href="/dashboard/inventory" legacyBehavior>
        <a className="inline-block text-blue-600 hover:underline">
          &larr; Back to Inventory
        </a>
      </Link>
    </div>
  );
};

export default InventoryDetail;
