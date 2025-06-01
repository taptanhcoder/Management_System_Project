// src/components/DrugForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface DrugFormProps {
  categoryId: string;
  drugId?: string;
}

interface Drug {
  id: string;
  name: string;
  quantity: number;
  price: number;
  description: string;
}

const DrugForm = ({ categoryId, drugId }: DrugFormProps) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (drugId) {
      // TODO: GET /api/catalog/categories/{categoryId}/drugs/{drugId}
      const mock: Drug = {
        id: drugId,
        name: "Paracetamol 500mg",
        quantity: 120,
        price: 5,
        description: "Pain reliever",
      };
      setName(mock.name);
      setQuantity(mock.quantity);
      setPrice(mock.price);
      setDescription(mock.description);
    }
  }, [categoryId, drugId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name, quantity, price, description };
    if (drugId) {
      // TODO: PUT /api/catalog/categories/{categoryId}/drugs/{drugId}
      alert(`Updated drug ${drugId} (demo)`);
    } else {
      // TODO: POST /api/catalog/categories/{categoryId}/drugs
      alert("Created new drug (demo)");
    }
    router.push(`/dashboard/catalog/${categoryId}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {drugId ? "Edit Drug" : "New Drug"}
        </h1>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-200 text-sm mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 text-sm mb-1">
              Quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
              min={0}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 text-sm mb-1">
              Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
              min={0}
              step="0.01"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 text-sm mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-white"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md"
            >
              {drugId ? "Update Drug" : "Create Drug"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DrugForm;
