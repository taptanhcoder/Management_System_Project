// src/components/InvoiceForm.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

interface Customer { id: string; name: string }
interface Drug { id: string; name: string; sellingPrice: number }
interface PrescriptionOption { id: string; customer: string }
interface ItemLine { drugId: string; quantity: number; unitPrice: number }

interface InvoiceFormProps {
  initialData?: {
    id: string;
    customerId: string;
    date: string;
    status: "PAID" | "UNPAID";
    items: ItemLine[];
  };
}

export default function InvoiceForm({ initialData }: InvoiceFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialData);

  const [prescriptionId, setPrescriptionId] = useState<string>("");
  const [customerId, setCustomerId] = useState<string>(
    initialData?.customerId || ""
  );
  const [date, setDate] = useState<string>(
    initialData?.date || new Date().toISOString().slice(0, 10)
  );
  const [status, setStatus] = useState<"PAID" | "UNPAID">(
    initialData?.status || "UNPAID"
  );
  const [items, setItems] = useState<ItemLine[]>(
    initialData?.items.map((it) => ({ ...it })) || [
      { drugId: "", quantity: 1, unitPrice: 0 },
    ]
  );

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [prescriptions, setPrescriptions] = useState<PrescriptionOption[]>(
    []
  );

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load options
  useEffect(() => {
    async function load() {
      const [cusRes, drgRes, presRes] = await Promise.all([
        fetch("/api/customers"),
        fetch("/api/inventory"),
        fetch("/api/prescriptions?status=PENDING"),
      ]);
      if (cusRes.ok) setCustomers(await cusRes.json());
      if (drgRes.ok) {
        const drs: any[] = await drgRes.json();
        setDrugs(
          drs.map((d) => ({
            id: d.id,
            name: d.name,
            sellingPrice: d.sellingPrice,
          }))
        );
      }
      if (presRes.ok) {
        const presList: any[] = await presRes.json();
        setPrescriptions(
          presList.map((p) => ({ id: p.id, customer: p.customer }))
        );
      }
    }
    load();
  }, []);

  // Nếu chọn prescription, populate lại
  useEffect(() => {
    if (!prescriptionId) return;
    async function loadPres() {
      const res = await fetch(`/api/prescriptions/${prescriptionId}`);
      if (!res.ok) return;
      const pres: any = await res.json();
      setCustomerId(pres.customer);
      setItems(
        pres.items.map((it: any) => ({
          drugId: it.drugId,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
        }))
      );
    }
    loadPres();
  }, [prescriptionId]);

  const updateItem = (
    idx: number,
    field: keyof ItemLine,
    value: string
  ) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item;
        if (field === "drugId") {
          const sel = drugs.find((d) => d.id === value);
          return {
            drugId: value,
            quantity: item.quantity,
            unitPrice: sel ? sel.sellingPrice : 0,
          };
        }
        return { ...item, [field]: Number(value) };
      })
    );
  };
  const addItem = () =>
    setItems((prev) => [...prev, { drugId: "", quantity: 1, unitPrice: 0 }]);
  const removeItem = (idx: number) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));

  const totalPreview = useMemo(
    () => items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0),
    [items]
  );
  const fmtCurr = (amt: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "USD",
    }).format(amt);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!date) return setError("Chọn ngày");
    if (!isEdit && !prescriptionId && !customerId)
      return setError("Chọn khách hoặc đơn thuốc");

    // Validate items
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (!it.drugId) return setError(`Dòng ${i + 1}: chọn thuốc`);
      if (it.quantity < 1) return setError(`Dòng ${i + 1}: số lượng >=1`);
    }

    setLoading(true);
    try {
      const payload: any = {
        date,
        status,
        items,
      };

      if (prescriptionId) {
        payload.prescriptionId = prescriptionId;
        delete payload.items; // nếu muốn dùng prescription items
      } else {
        payload.customerId = customerId;
      }

      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? `/api/invoices/${initialData!.id}`
        : "/api/invoices";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi server");
      router.push("/dashboard/invoices");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-gray-800 rounded text-white space-y-4"
    >
      <h2 className="text-2xl font-semibold">
        {isEdit ? "Chỉnh sửa hóa đơn" : "Tạo hóa đơn"}
      </h2>
      {error && <div className="bg-red-600 p-2 rounded">{error}</div>}

      {!isEdit && (
        <div>
          <label>Đơn thuốc (nếu có)</label>
          <select
            value={prescriptionId}
            onChange={(e) => setPrescriptionId(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded"
          >
            <option value="">-- Không dùng đơn --</option>
            {prescriptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} – {p.customer}
              </option>
            ))}
          </select>
        </div>
      )}

      {!prescriptionId && (
        <div>
          <label>Khách hàng</label>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded"
          >
            <option value="">-- Chọn --</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label>Ngày</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded"
        />
      </div>

      <div>
        <label>Trạng thái</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          className="w-full p-2 bg-gray-700 rounded"
        >
          <option value="UNPAID">Chưa thanh toán</option>
          <option value="PAID">Đã thanh toán</option>
        </select>
      </div>

      <div>
        <h3 className="font-medium">Items</h3>
        {items.map((it, idx) => (
          <div key={idx} className="flex space-x-2 mt-2">
            <select
              value={it.drugId}
              onChange={(e) => updateItem(idx, "drugId", e.target.value)}
              className="flex-1 p-2 bg-gray-700 rounded"
            >
              <option value="">-- Thuốc --</option>
              {drugs.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={it.quantity}
              onChange={(e) => updateItem(idx, "quantity", e.target.value)}
              className="w-20 p-2 bg-gray-700 rounded"
            />
            <input
              type="number"
              step="0.01"
              min="0"
              value={it.unitPrice}
              onChange={(e) => updateItem(idx, "unitPrice", e.target.value)}
              className="w-28 p-2 bg-gray-700 rounded"
            />
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="px-2 text-red-500"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="mt-2 text-blue-400"
        >
          + Thêm dòng
        </button>
      </div>

      <div className="text-right">
        Tổng: <strong>{fmtCurr(totalPreview)}</strong>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-green-600 rounded"
      >
        {loading ? (isEdit ? "Đang lưu..." : "Đang tạo...") : isEdit ? "Lưu" : "Tạo"}
      </button>
    </form>
  );
}
