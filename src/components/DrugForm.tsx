
// src/components/DrugForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface DrugFormProps {
  categoryId: string;
  drugId?: string; // Nếu có → edit, không có → create
}

export default function DrugForm({ categoryId, drugId }: DrugFormProps) {
  const router = useRouter();

  // State form
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [expiryDate, setExpiryDate] = useState(""); // "YYYY-MM-DD"
  const [supplier, setSupplier] = useState("");
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [description, setDescription] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Nếu edit (có drugId), fetch data để prefill
  useEffect(() => {
    if (!drugId) return;
    setLoadingData(true);
    fetch(`/api/catalog/categories/${categoryId}/drugs/${drugId}`)
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Cannot fetch drug");
        }
        return res.json();
      })
      .then((data) => {
        setName(data.name);
        setQuantity(data.quantity);
        setExpiryDate(data.expiryDate.slice(0, 10)); // Tách "YYYY-MM-DD"
        setSupplier(data.supplier);
        setPurchasePrice(data.purchasePrice);
        setSellingPrice(data.sellingPrice);
        setDescription(data.description || "");
      })
      .catch((e: any) => {
        console.error(e);
        setError(e.message);
      })
      .finally(() => {
        setLoadingData(false);
      });
  }, [categoryId, drugId]);

  const handleDeleteDrug = async () => {
    if (!drugId) return;
    if (!confirm(`Delete drug "${name}"?`)) return;
    try {
      const res = await fetch(
        `/api/catalog/categories/${categoryId}/drugs/${drugId}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Cannot delete drug");
      } else {
        router.push(`/dashboard/catalog/${categoryId}`);
      }
    } catch (e) {
      console.error(e);
      alert("Network error. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || quantity < 0 || !expiryDate || !supplier.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      let res: Response;
      const payload = {
        name: name.trim(),
        quantity,
        expiryDate,
        supplier: supplier.trim(),
        purchasePrice,
        sellingPrice,
        description: description.trim(),
      };

      if (drugId) {
        // EDIT
        res = await fetch(
          `/api/catalog/categories/${categoryId}/drugs/${drugId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      } else {
        // CREATE
        res = await fetch(
          `/api/catalog/categories/${categoryId}/drugs`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      }

      if (!res.ok) {
        const data = await res.json();
        if (data.errors) {
          setError(data.errors.map((err: any) => err.message).join(" "));
        } else if (data.error) {
          setError(data.error);
        } else {
          setError("Failed to save drug.");
        }
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      router.push(`/dashboard/catalog/${categoryId}`); // Quay về trang detail category
    } catch {
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  if (loadingData) {
    return <p className="p-6">Loading drug data...</p>;
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">
        {drugId ? "Edit Drug" : "Add New Drug"}
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1 text-gray-200">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={!!drugId} // Khi edit, khóa trường name
          />
          {drugId && (
            <p className="text-xs text-gray-400 mt-1">
              Cannot change name when editing.
            </p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label className="block mb-1 text-gray-200">
            Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min={0}
            required
            className="w-full px-3 py-2 border rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block mb-1 text-gray-200">
            Expiry Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Supplier */}
        <div>
          <label className="block mb-1 text-gray-200">
            Supplier <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Prices */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-gray-200">Purchase Price</label>
            <input
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(Number(e.target.value))}
              min={0}
              step="0.01"
              className="w-full px-3 py-2 border rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-200">Selling Price</label>
            <input
              type="number"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(Number(e.target.value))}
              min={0}
              step="0.01"
              className="w-full px-3 py-2 border rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 text-gray-200">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md"
          >
            {isLoading
              ? drugId
                ? "Updating..."
                : "Creating..."
              : drugId
              ? "Update Drug"
              : "Create Drug"}
          </button>
          <button
            type="button"
            onClick={() =>
              drugId
                ? router.back()
                : router.push(`/dashboard/catalog/${categoryId}`)
            }
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          {drugId && (
            <button
              type="button"
              onClick={handleDeleteDrug}
              className="ml-auto bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
