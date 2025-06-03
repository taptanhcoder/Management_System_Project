// src/components/InvoiceForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface CustomerOption {
  id: string;
  name: string;
}

interface DrugOption {
  id: string;
  name: string;
}

interface ItemLine {
  id?: string;
  drugId: string;
  quantity: number;
  unitPrice: number;
}

interface InvoiceFormProps {
  initialData?: {
    id: string;
    customerId: string;
    date: string; // "YYYY-MM-DD"
    status: "PAID" | "UNPAID";
    items: { id: string; drugId: string; quantity: number; unitPrice: number }[];
  };
}

export default function InvoiceForm({ initialData }: InvoiceFormProps) {
  const router = useRouter();

  // ─── State chính ─────────────────────────────────────────────────────
  const [customerId, setCustomerId] = useState(initialData?.customerId || "");
  const [date, setDate] = useState(initialData?.date || "");
  const [status, setStatus] = useState<"PAID" | "UNPAID">(
    initialData?.status || "UNPAID"
  );

  // Nếu có initialData, pre-fill items, ngược lại mặc định 1 dòng
  const [items, setItems] = useState<ItemLine[]>(
    initialData
      ? initialData.items.map((it) => ({
          id: it.id,
          drugId: it.drugId,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
        }))
      : [{ drugId: "", quantity: 1, unitPrice: 0 }]
  );

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ─── Dropdown data: customers + drugs ────────────────────────────────
  const [customerOptions, setCustomerOptions] = useState<CustomerOption[]>([]);
  const [drugOptions, setDrugOptions] = useState<DrugOption[]>([]);

  useEffect(() => {
    // Load danh sách customers
    async function loadCustomers() {
      try {
        const res = await fetch("/api/customers");
        if (res.ok) {
          const data = await res.json();
          // Mỗi customer: { id, name }
          const opts = data.map((c: any) => ({ id: c.id, name: c.name }));
          setCustomerOptions(opts);
        }
      } catch (err) {
        console.error("Failed to load customers:", err);
      }
    }
    // Load danh sách drugs
    async function loadDrugs() {
      try {
        const res = await fetch("/api/inventory"); // giả sử bạn có /api/inventory trả về list thuốc
        if (res.ok) {
          const data = await res.json();
          const opts = data.map((d: any) => ({ id: d.id, name: d.name }));
          setDrugOptions(opts);
        }
      } catch (err) {
        console.error("Failed to load drugs:", err);
      }
    }
    loadCustomers();
    loadDrugs();
  }, []);

  // ─── Hàm để cập nhật từng dòng items ──────────────────────────────────
  const updateItemLine = (
    index: number,
    field: "drugId" | "quantity" | "unitPrice",
    value: string | number
  ) => {
    setItems((prev) => {
      const copy = [...prev];
      if (field === "drugId") {
        copy[index].drugId = value as string;
      } else if (field === "quantity") {
        copy[index].quantity = Number(value);
      } else if (field === "unitPrice") {
        copy[index].unitPrice = Number(value);
      }
      return copy;
    });
  };

  const addItemRow = () => {
    setItems((prev) => [...prev, { drugId: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItemRow = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // ─── Xử lý khi submit form ──────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerId || !date) {
      setError("Please select a customer and date.");
      return;
    }
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (!it.drugId) {
        setError(`Line ${i + 1}: Please select a drug.`);
        return;
      }
      if (it.quantity <= 0) {
        setError(`Line ${i + 1}: Quantity must be at least 1.`);
        return;
      }
      if (it.unitPrice < 0) {
        setError(`Line ${i + 1}: Unit price cannot be negative.`);
        return;
      }
    }
    setIsLoading(true);

    // Chuẩn bị payload
    const payload = {
      customerId,
      date,
      status,
      items: items.map((it) => ({
        drugId: it.drugId,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
      })),
    };

    try {
      let res;
      if (initialData && initialData.id) {
        // PUT /api/invoices/[id]
        res = await fetch(`/api/invoices/${initialData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // POST /api/invoices
        res = await fetch("/api/invoices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        setError(
          data.errors
            ? data.errors.map((err: any) => err.message).join(" ")
            : data.error || "Failed to save invoice."
        );
        setIsLoading(false);
        return;
      }

      const savedInvoice = await res.json();
      setIsLoading(false);

      if (initialData && initialData.id) {
        router.push(`/dashboard/invoices/${initialData.id}`);
      } else {
        router.push("/dashboard/invoices");
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">
        {initialData ? "Edit Invoice" : "New Invoice"}
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer */}
        <div>
          <label className="block mb-1 text-gray-200">Customer</label>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select customer</option>
            {customerOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block mb-1 text-gray-200">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block mb-1 text-gray-200">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full px-3 py-2 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="UNPAID">Unpaid</option>
            <option value="PAID">Paid</option>
          </select>
        </div>

        {/* Items */}
        <div className="border-t pt-4 space-y-4">
          <h2 className="text-xl font-semibold mb-2 text-white">Items</h2>
          {items.map((item, idx) => (
            <div key={idx} className="flex items-end space-x-4">
              {/* Drug */}
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">Drug</label>
                <select
                  value={item.drugId}
                  onChange={(e) =>
                    updateItemLine(idx, "drugId", e.target.value)
                  }
                  required
                  className="w-full px-3 py-2 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select drug</option>
                  {drugOptions.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div className="w-24">
                <label className="block mb-1 text-gray-200">Qty</label>
                <input
                  type="number"
                  value={item.quantity}
                  min={1}
                  onChange={(e) =>
                    updateItemLine(idx, "quantity", e.target.value)
                  }
                  required
                  className="w-full px-3 py-2 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Unit Price */}
              <div className="w-28">
                <label className="block mb-1 text-gray-200">Unit Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={item.unitPrice}
                  min={0}
                  onChange={(e) =>
                    updateItemLine(idx, "unitPrice", e.target.value)
                  }
                  required
                  className="w-full px-3 py-2 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Remove row */}
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItemRow(idx)}
                  className="text-red-600 hover:text-red-800 mb-1"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addItemRow}
            className="text-blue-400 hover:underline"
          >
            + Add another item
          </button>
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
          >
            {isLoading
              ? initialData
                ? "Saving..."
                : "Creating..."
              : initialData
              ? "Save Changes"
              : "Create Invoice"}
          </button>
        </div>
      </form>
    </div>
  );
}
