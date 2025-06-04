// src/components/InventoryForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

interface InventoryFormProps {
  id?: string;
}

interface Category {
  id: string;
  name: string;
}

interface DrugDetail {
  id: string;
  name: string;
  category: { id: string; name: string };
  quantity: number;
  expiryDate: string;
  supplier: string;
  purchasePrice: number;
  sellingPrice: number;
  description: string;
}

const fetcher = (url: string) =>
  fetch(url).then(async (res) => {
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Error fetching data");
    }
    return res.json();
  });

const InventoryForm = ({ id }: InventoryFormProps) => {
  const router = useRouter();

  // Form state
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [expiryDate, setExpiryDate] = useState("");
  const [supplier, setSupplier] = useState("");
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [description, setDescription] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch danh sách category
  const {
    data: categories,
    error: categoriesError,
    isLoading: loadingCategories,
  } = useSWR<Category[]>("/api/catalog/categories", fetcher);

  // Nếu có id, fetch chi tiết để fill form
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`/api/inventory/${id}`)
        .then(async (res) => {
          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Cannot fetch drug");
          }
          const data: DrugDetail = await res.json();
          setName(data.name);
          setCategoryId(data.category.id);
          setQuantity(data.quantity);
          setExpiryDate(data.expiryDate.slice(0, 10));
          setSupplier(data.supplier);
          setPurchasePrice(data.purchasePrice);
          setSellingPrice(data.sellingPrice);
          setDescription(data.description || "");
        })
        .catch((e: any) => {
          console.error(e);
          setErrorMsg(e.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name || !categoryId || quantity < 0 || !expiryDate || !supplier) {
      setErrorMsg("Please fill all required fields");
      return;
    }

    const payload = {
      name,
      categoryId,
      quantity,
      expiryDate, // "YYYY-MM-DD"
      supplier,
      purchasePrice,
      sellingPrice,
      description,
    };

    try {
      let res;
      if (id) {
        // EDIT: PUT /api/inventory/{id}
        res = await fetch(`/api/inventory/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // CREATE / RESTOCK: POST /api/inventory
        res = await fetch("/api/inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const err = await res.json();
        setErrorMsg(
          err.error || (err.errors ? JSON.stringify(err.errors) : "Error")
        );
      } else {
        router.push("/dashboard/inventory");
      }
    } catch (e: any) {
      console.error(e);
      setErrorMsg("Network or server error");
    }
  };

  if (loadingCategories) {
    return <div className="p-6">Loading categories...</div>;
  }
  if (categoriesError) {
    return <div className="p-6 text-red-600">Error loading categories</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {id ? "Edit Drug" : "Add / Restock Drug"}
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {errorMsg && (
          <div className="mb-4 text-red-600 font-medium">{errorMsg}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 text-sm mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={!!id} // Khi edit, không cho đổi name
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-white ${
                id ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
            {id && (
              <p className="text-xs text-gray-500 mt-1">
                Cannot change name when editing. To restock, adjust quantity.
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 text-sm mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              disabled={!!id}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-white ${
                id ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <option value="">-- Select Category --</option>
              {categories!.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 text-sm mb-1">
              Quantity <span className="text-red-500">*</span>
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
              Expiry Date <span className="text-red-500">*</span>
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
              Supplier <span className="text-red-500">*</span>
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
              {id ? "Update Drug" : "Create / Restock Drug"}
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
