// src/components/InventoryForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface InventoryFormProps {
  id?: string; // nếu có, edit; nếu không, new
}

const InventoryForm = ({ id }: InventoryFormProps) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [expiryDate, setExpiryDate] = useState("");
  const [supplier, setSupplier] = useState("");
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [description, setDescription] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (id) {
      // TODO: fetch GET /api/inventory/{id}
      const mock = {
        name: "Paracetamol 500mg",
        category: "Analgesics",
        quantity: 120,
        expiryDate: "2025-12-01",
        supplier: "ABC Pharma",
        purchasePrice: 1.5,
        sellingPrice: 2,
        description: "Pain reliever.",
      };
      setName(mock.name);
      setCategory(mock.category);
      setQuantity(mock.quantity);
      setExpiryDate(mock.expiryDate);
      setSupplier(mock.supplier);
      setPurchasePrice(mock.purchasePrice);
      setSellingPrice(mock.sellingPrice);
      setDescription(mock.description);
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      category,
      quantity,
      expiryDate,
      supplier,
      purchasePrice,
      sellingPrice,
      description,
    };
    if (id) {
      // TODO: PUT /api/inventory/{id}
      alert(`Updated drug ${id} (demo)`);
    } else {
      // TODO: POST /api/inventory
      alert("Created new drug (demo)");
    }
    router.push("/dashboard/inventory");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {id ? "Edit Drug" : "Add New Drug"}
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
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

          {/* Category */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 text-sm mb-1">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-white"
            />
          </div>

          {/* Quantity */}
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

          {/* Expiry Date */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 text-sm mb-1">
              Expiry Date
            </label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-white"
            />
          </div>

          {/* Supplier */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 text-sm mb-1">
              Supplier
            </label>
            <input
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-white"
            />
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-200 text-sm mb-1">
                Purchase Price
              </label>
              <input
                type="number"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value))}
                required
                min={0}
                step="0.01"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-200 text-sm mb-1">
                Selling Price
              </label>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                required
                min={0}
                step="0.01"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Description */}
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

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md"
            >
              {id ? "Update Drug" : "Create Drug"}
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

export default InventoryForm;
