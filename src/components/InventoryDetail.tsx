// src/components/InventoryDetail.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Drug {
  id: string;
  name: string;
  category: string;
  quantity: number;
  expiryDate: string;
  supplier: string;
  purchasePrice: number;
  sellingPrice: number;
  description: string;
}

interface InventoryDetailProps {
  id: string;
}

const InventoryDetail = ({ id }: InventoryDetailProps) => {
  const [drug, setDrug] = useState<Drug | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchDrug() {
      // TODO: call GET /api/inventory/{id}
      const mock: Drug = {
        id,
        name: "Paracetamol 500mg",
        category: "Analgesics",
        quantity: 120,
        expiryDate: "2025-12-01",
        supplier: "ABC Pharma",
        purchasePrice: 1.5,
        sellingPrice: 2,
        description: "Pain reliever and fever reducer.",
      };
      setDrug(mock);
    }
    fetchDrug();
  }, [id]);

  const handleDelete = () => {
    if (confirm(`Delete drug ${id}?`)) {
      // TODO: DELETE /api/inventory/{id}
      alert(`Deleted ${id} (demo)`);
      router.push("/dashboard/inventory");
    }
  };

  if (!drug) {
    return <p className="p-6">Loading drug details...</p>;
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
          <strong>Category:</strong> {drug.category}
        </p>
        <p>
          <strong>Quantity:</strong> {drug.quantity}
        </p>
        <p>
          <strong>Expiry Date:</strong>{" "}
          {new Date(drug.expiryDate).toLocaleDateString("en-GB")}
        </p>
        <p>
          <strong>Supplier:</strong> {drug.supplier}
        </p>
        <p>
          <strong>Purchase Price:</strong>{" "}
          {drug.purchasePrice.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </p>
        <p>
          <strong>Selling Price:</strong>{" "}
          {drug.sellingPrice.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </p>
        <p>
          <strong>Description:</strong> {drug.description}
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
