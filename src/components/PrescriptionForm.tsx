// src/components/PrescriptionForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface DrugOption {
  id: string;
  name: string;
  purchasePrice: number;
}

interface MedicineLine {
  drugId: string;
  quantity: number;
  unitPrice: number;
}

export default function PrescriptionForm() {
  const router = useRouter();

  // Form state
  const [customer, setCustomer] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<"PENDING" | "CONFIRMED">("PENDING");

  const [medicines, setMedicines] = useState<MedicineLine[]>([
    { drugId: "", quantity: 1, unitPrice: 0 },
  ]);

  // Dropdown options
  const [drugOptions, setDrugOptions] = useState<DrugOption[]>([]);

  useEffect(() => {
    async function loadDrugs() {
      try {
        const res = await fetch("/api/inventory");
        if (!res.ok) {
          console.error("Failed to load drugs:", await res.text());
          return;
        }
        const list = await res.json();
        const opts = list.map((d: any) => ({
          id: d.id,
          name: d.name,
          purchasePrice: d.purchasePrice,
        }));
        setDrugOptions(opts);
      } catch (err) {
        console.error("Network error when loading drugs:", err);
      }
    }
    loadDrugs();
  }, []);

  // Update a medicine line
  const updateMedicineLine = (
    index: number,
    field: keyof MedicineLine,
    value: string | number
  ) => {
    setMedicines((prev) => {
      const copy = [...prev];
      const line = copy[index];
      if (field === "drugId") {
        const id = value as string;
        line.drugId = id;
        const drug = drugOptions.find((d) => d.id === id);
        line.unitPrice = drug ? drug.purchasePrice * line.quantity : 0;
      } else if (field === "quantity") {
        const qty = Number(value);
        line.quantity = qty;
        const drug = drugOptions.find((d) => d.id === line.drugId);
        line.unitPrice = drug ? drug.purchasePrice * qty : 0;
      }
      return copy;
    });
  };

  const addMedicineRow = () =>
    setMedicines((prev) => [...prev, { drugId: "", quantity: 1, unitPrice: 0 }]);
  const removeMedicineRow = (index: number) =>
    setMedicines((prev) => prev.filter((_, i) => i !== index));

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.trim()) return alert("Vui lòng nhập tên khách hàng.");
    if (!date) return alert("Vui lòng chọn ngày.");
    for (let i = 0; i < medicines.length; i++) {
      const line = medicines[i];
      if (!line.drugId) return alert(`Dòng ${i + 1}: Vui lòng chọn thuốc.`);
      if (line.quantity <= 0)
        return alert(`Dòng ${i + 1}: Số lượng phải lớn hơn 0.`);
    }
    const payload = { customer: customer.trim(), date, status, medicines };
    try {
      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        console.error("Create prescription failed:", err);
        return alert("Tạo đơn thuốc thất bại. Xem console để biết thêm chi tiết.");
      }
      router.push("/dashboard/prescriptions");
    } catch (err) {
      console.error("Network error:", err);
      alert("Lỗi mạng. Vui lòng thử lại.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        New Prescription
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium text-gray-900 dark:text-white">
            Customer
          </label>
          <input
            type="text"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-900 dark:text-white">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-900 dark:text-white">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white"
          >
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
          </select>
        </div>
        <div className="border-t pt-4 space-y-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            Medicines
          </h2>
          {medicines.map((item, idx) => (
            <div key={idx} className="flex items-end space-x-4">
              <div className="flex-1">
                <label className="block mb-1 text-gray-900 dark:text-white">
                  Medicine
                </label>
                <select
                  value={item.drugId}
                  onChange={(e) => updateMedicineLine(idx, "drugId", e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Select medicine</option>
                  {drugOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-24">
                <label className="block mb-1 text-gray-900 dark:text-white">
                  Qty
                </label>
                <input
                  type="number"
                  value={item.quantity}
                  min={1}
                  onChange={(e) => updateMedicineLine(idx, "quantity", Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="w-28">
                <label className="block mb-1 text-gray-900 dark:text-white">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={item.unitPrice}
                  readOnly
                  className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                />
              </div>
              {medicines.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMedicineRow(idx)}
                  className="text-red-600 hover:text-red-800 mb-1"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addMedicineRow}
            className="text-blue-600 hover:underline"
          >
            + Add another medicine
          </button>
        </div>
        <div>
          <button
            type="submit"
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Create Prescription
          </button>
        </div>
      </form>
    </div>
  );
}
