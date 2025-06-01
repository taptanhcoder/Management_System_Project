// src/components/MedicineLineItem.tsx
"use client";

import { ChangeEvent, useEffect, useState } from "react";

interface MedicineOption {
  name: string;
  price: number;
}

interface LineItem {
  name: string;
  quantity: number;
  price: number;
}

interface MedicineLineItemProps {
  index: number;
  items: MedicineOption[]; // danh sách medicine để chọn
  defaultValue?: LineItem;
  onChange: (idx: number, name: string, quantity: number, price: number) => void;
  onRemove: (idx: number) => void;
}

export default function MedicineLineItem({
  index,
  items,
  defaultValue,
  onChange,
  onRemove,
}: MedicineLineItemProps) {
  // State nội bộ
  const [selectedName, setSelectedName] = useState(defaultValue?.name || "");
  const [quantity, setQuantity] = useState(defaultValue?.quantity || 1);
  const [price, setPrice] = useState(defaultValue?.price || 0);

  // Khi defaultValue thay đổi (trường hợp trang edit), cập nhật state
  useEffect(() => {
    if (defaultValue) {
      setSelectedName(defaultValue.name);
      setQuantity(defaultValue.quantity);
      setPrice(defaultValue.price);
    }
  }, [defaultValue]);

  // Khi chọn tên thuốc mới
  const handleNameChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    setSelectedName(name);

    // tìm giá tương ứng
    const found = items.find((it) => it.name === name);
    const newPrice = found ? found.price : 0;
    setPrice(newPrice);

    // gọi callback
    onChange(index, name, quantity, newPrice);
  };

  // Khi số lượng thay đổi
  const handleQtyChange = (e: ChangeEvent<HTMLInputElement>) => {
    const qty = parseInt(e.target.value) || 0;
    setQuantity(qty);
    onChange(index, selectedName, qty, price);
  };

  return (
    <div className="flex items-end gap-4 border-b pb-4 mb-4">
      {/* Chọn thuốc */}
      <div className="flex-1">
        <label className="block text-gray-700 dark:text-gray-200 text-sm mb-1">
          Medicine
        </label>
        <select
          value={selectedName}
          onChange={handleNameChange}
          required
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-white"
        >
          <option value="" disabled>
            Select medicine
          </option>
          {items.map((it) => (
            <option key={it.name} value={it.name}>
              {it.name}
            </option>
          ))}
        </select>
      </div>

      {/* Số lượng */}
      <div className="w-24">
        <label className="block text-gray-700 dark:text-gray-200 text-sm mb-1">
          Quantity
        </label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={handleQtyChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-white"
        />
      </div>

      {/* Giá (chỉ đọc) */}
      <div className="w-32">
        <label className="block text-gray-700 dark:text-gray-200 text-sm mb-1">
          Unit Price
        </label>
        <input
          type="text"
          value={price.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
          readOnly
          className="w-full px-3 py-2 border bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 rounded-md"
        />
      </div>

      {/* Nút xóa dòng */}
      <div className="w-10 flex justify-end">
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-600 hover:text-red-800"
          title="Remove"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
