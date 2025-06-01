// src/components/PrescriptionForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MedicineLineItem from "./MedicineLineItem"; // Đảm bảo đường dẫn chính xác

interface PrescriptionFormProps {
  id?: string;
}

interface Prescription {
  id: string;
  customer: string;
  date: string;
  status: "Pending" | "Confirmed";
  medicines: { name: string; quantity: number; price: number }[];
  total: number;
}

const PrescriptionForm = ({ id }: PrescriptionFormProps) => {
  const [customer, setCustomer] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<"Pending" | "Confirmed">("Pending");
  const [medicineItems, setMedicineItems] = useState<
    { name: string; quantity: number; price: number }[]
  >([{ name: "", quantity: 1, price: 0 }]);
  const [medicineOptions, setMedicineOptions] = useState<
    { name: string; price: number }[]
  >([]);
  const router = useRouter();

  useEffect(() => {
    // TODO: fetch danh sách medicine từ API
    const sampleOptions: { name: string; price: number }[] = [
      { name: "Paracetamol 500mg", price: 5 },
      { name: "Vitamin C 1000mg", price: 10 },
      { name: "Ibuprofen 200mg", price: 4 },
    ];
    setMedicineOptions(sampleOptions);

    if (id) {
      // TODO: fetch prescription theo id
      const mock: Prescription = {
        id,
        customer: "John Doe",
        date: "2025-05-25",
        status: "Pending",
        medicines: [
          { name: "Paracetamol 500mg", quantity: 10, price: 5 },
          { name: "Vitamin C 1000mg", quantity: 5, price: 10 },
        ],
        total: 150,
      };
      setCustomer(mock.customer);
      setDate(mock.date);
      setStatus(mock.status);
      setMedicineItems(mock.medicines);
    }
  }, [id]);

  const handleItemChange = (
    idx: number,
    name: string,
    quantity: number,
    price: number
  ) => {
    const updated = [...medicineItems];
    updated[idx] = { name, quantity, price };
    setMedicineItems(updated);
  };

  const handleRemoveItem = (idx: number) => {
    setMedicineItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const addNewLineItem = () => {
    setMedicineItems((prev) => [...prev, { name: "", quantity: 1, price: 0 }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const total = medicineItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    const payload = { customer, date, status, medicines: medicineItems, total };

    if (id) {
      // TODO: PUT /api/prescriptions/{id}
      alert(`Updated prescription ${id} (demo)`);
    } else {
      // TODO: POST /api/prescriptions
      alert("Created new prescription (demo)");
    }
    router.push("/dashboard/prescriptions");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {id ? "Edit Prescription" : "New Prescription"}
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 text-sm mb-1">
              Customer
            </label>
            <input
              type="text"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-white"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 text-sm mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-white"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 text-sm mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "Pending" | "Confirmed")
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-white"
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
            </select>
          </div>

          {/* Medicines */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Medicines
            </h2>
            {medicineItems.map((item, idx) => (
              <MedicineLineItem
                key={idx}
                index={idx}
                items={medicineOptions}
                defaultValue={item.name ? item : undefined}
                onChange={handleItemChange}
                onRemove={handleRemoveItem}
              />
            ))}
            <button
              type="button"
              onClick={addNewLineItem}
              className="text-blue-600 hover:underline text-sm"
            >
              + Add another medicine
            </button>
          </div>

          {/* Submit / Cancel */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md"
            >
              {id ? "Update Prescription" : "Create Prescription"}
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

export default PrescriptionForm;
