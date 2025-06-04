// src/components/CategoryForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface CategoryFormProps {
  id?: string; // Có thì vào chế độ edit, không có thì create
}

export default function CategoryForm({ id }: CategoryFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Nếu có id (edit), fetch dữ liệu để prefill
  useEffect(() => {
    if (!id) return;
    setLoadingData(true);
    fetch(`/api/catalog/categories/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Cannot fetch category");
        }
        return res.json();
      })
      .then((data) => {
        setName(data.name);
        setDescription(data.description);
      })
      .catch((e: any) => {
        console.error(e);
        setError(e.message);
      })
      .finally(() => {
        setLoadingData(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !description.trim()) {
      setError("Please fill in both name and description.");
      return;
    }

    setIsLoading(true);

    try {
      let res: Response;
      if (id) {
        // EDIT: PUT
        res = await fetch(`/api/catalog/categories/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), description: description.trim() }),
        });
      } else {
        // CREATE: POST
        res = await fetch("/api/catalog/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), description: description.trim() }),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        if (data.errors) {
          setError(data.errors.map((err: any) => err.message).join(" "));
        } else if (data.error) {
          setError(data.error);
        } else {
          setError("Failed to save category.");
        }
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      router.push("/dashboard/catalog"); // Sau khi thành công, về trang danh sách
    } catch {
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  if (loadingData) {
    return <p className="p-6">Loading category data...</p>;
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">
        {id ? "Edit Category" : "New Category"}
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1 text-gray-200">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block mb-1 text-gray-200">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition"
        >
          {isLoading
            ? id
              ? "Updating..."
              : "Creating..."
            : id
            ? "Update Category"
            : "Create Category"}
        </button>
      </form>
    </div>
  );
}