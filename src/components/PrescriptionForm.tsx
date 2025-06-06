// src/components/PrescriptionForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface DrugOption {
  id: string;
  name: string;
}

interface MedicineLine {
  drugId: string;
  quantity: number;
  unitPrice: number;
}

export default function PrescriptionForm() {
  const router = useRouter();

  // ─── 1. State form chính ─────────────────────────────
  const [customer, setCustomer] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<"PENDING" | "CONFIRMED">("PENDING");

  // Medicines (mảng dòng thuốc): mặc định 1 dòng rỗng
  const [medicines, setMedicines] = useState<MedicineLine[]>([
    { drugId: "", quantity: 1, unitPrice: 0 },
  ]);

  // ─── 2. State để load dropdown “Chọn thuốc” ─────────────
  const [drugOptions, setDrugOptions] = useState<DrugOption[]>([]);

  useEffect(() => {
    // Fetch danh sách drug từ API
    async function loadDrugs() {
      try {
        const res = await fetch("/api/inventory");
        if (!res.ok) {
          console.error("Failed to load drugs:", await res.text());
          return;
        }
        const list = await res.json();
        // Giả sử mỗi đối tượng trả về có { id, name }
        const opts = list.map((d: any) => ({
          id: d.id,
          name: d.name,
        }));
        setDrugOptions(opts);
      } catch (err) {
        console.error("Network error when loading drugs:", err);
      }
    }
    loadDrugs();
  }, []);

  // ─── 3. Các hàm xử lý form ────────────────────────────
  const updateMedicineLine = (
    index: number,
    field: "drugId" | "quantity" | "unitPrice",
    value: string | number
  ) => {
    setMedicines((prev) => {
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

  const addMedicineRow = () => {
    setMedicines((prev) => [
      ...prev,
      { drugId: "", quantity: 1, unitPrice: 0 },
    ]);
  };

  const removeMedicineRow = (index: number) => {
    setMedicines((prev) => prev.filter((_, i) => i !== index));
  };

  // ─── 4. Xử lý submit ───────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate cơ bản trước khi gửi
    if (!customer.trim()) {
      alert("Vui lòng nhập tên khách hàng.");
      return;
    }
    if (!date) {
      alert("Vui lòng chọn ngày.");
      return;
    }
    // Mỗi dòng thuốc đều phải có drugId, quantity > 0, unitPrice >= 0
    for (let i = 0; i < medicines.length; i++) {
      const line = medicines[i];
      if (!line.drugId) {
        alert(`Dòng ${i + 1}: Vui lòng chọn thuốc.`);
        return;
      }
      if (line.quantity <= 0) {
        alert(`Dòng ${i + 1}: Số lượng phải lớn hơn 0.`);
        return;
      }
      if (line.unitPrice < 0) {
        alert(`Dòng ${i + 1}: Giá phải ≥ 0.`);
        return;
      }
    }

    // Chuẩn bị payload cho API
    const payload = {
      customer: customer.trim(),
      date, // định dạng yyyy-MM-dd từ <input type="date">
      status,
      medicines: medicines.map((m) => ({
        drugId: m.drugId,
        quantity: m.quantity,
        unitPrice: m.unitPrice,
      })),
    };

    try {
      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Nếu backend trả lỗi 400 (validate) hay 500 (server)
        const err = await res.json();
        console.error("Create prescription failed:", err);
        // Bạn có thể show message chi tiết ra UI thay vì console.log
        alert("Tạo đơn thuốc thất bại. Xem console để biết thêm chi tiết.");
        return;
      }

      // Nếu thành công (201), điều hướng về trang list prescriptions:
      router.push("/dashboard/prescriptions");
    } catch (err) {
      console.error("Network error:", err);
      alert("Lỗi mạng. Vui lòng thử lại.");
    }
  };

  // ─── 5. JSX form ───────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Tiêu đề chính */}
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        New Prescription
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ─ Customer ────────────────── */}
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

        {/* ─ Date ─────────────────────── */}
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

        {/* ─ Status ───────────────────── */}
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

        {/* ─ Medicines (nhiều dòng) ─────────────────────────── */}
        <div className="border-t pt-4 space-y-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            Medicines
          </h2>

          {medicines.map((item, idx) => (
            <div key={idx} className="flex items-end space-x-4">
              {/* ─ Chọn thuốc ───────────────── */}
              <div className="flex-1">
                <label className="block mb-1 text-gray-900 dark:text-white">
                  Medicine
                </label>
                <select
                  value={item.drugId}
                  onChange={(e) =>
                    updateMedicineLine(idx, "drugId", e.target.value)
                  }
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

              {/* ─ Số lượng ─────────────────── */}
              <div className="w-24">
                <label className="block mb-1 text-gray-900 dark:text-white">
                  Qty
                </label>
                <input
                  type="number"
                  value={item.quantity}
                  min={1}
                  onChange={(e) =>
                    updateMedicineLine(idx, "quantity", e.target.value)
                  }
                  required
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* ─ Giá (unit price) ─────────── */}
              <div className="w-28">
                <label className="block mb-1 text-gray-900 dark:text-white">
                  Unit Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={item.unitPrice}
                  min={0}
                  onChange={(e) =>
                    updateMedicineLine(idx, "unitPrice", e.target.value)
                  }
                  required
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* ─ Nút xóa dòng (nếu > 1 dòng) ─ */}
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

        {/* ─ Submit button ──────────────────────────────── */}
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
