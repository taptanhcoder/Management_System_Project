"use client";

import Image from "next/image";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

type Medicine = {
  id: number;
  name: string;
  quantity: number;
  expiryDate: string; // yyyy-mm-dd
};

const lowStockMedicines: Medicine[] = [
  { id: 1, name: "Vitamin C 1000mg", quantity: 5, expiryDate: "2025-07-01" },
  { id: 2, name: "Ibuprofen 200mg", quantity: 3, expiryDate: "2025-06-15" },
  { id: 3, name: "Paracetamol 500mg", quantity: 2, expiryDate: "2025-06-20" },
  { id: 4, name: "Vitamin C 1000mg", quantity: 5, expiryDate: "2025-07-01" },
  { id: 5, name: "Ibuprofen 200mg", quantity: 3, expiryDate: "2025-06-15" },
  { id: 6, name: "Paracetamol 500mg", quantity: 2, expiryDate: "2025-06-20" },
  { id: 7, name: "Paracetamol 500mg", quantity: 2, expiryDate: "2025-06-20" }
];

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div className="bg-white p-4 rounded-md">
      <Calendar onChange={onChange} value={value} />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">Low Stock Medicines</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <div className="flex flex-col gap-4">
        {lowStockMedicines.map((medicine) => (
          <div
            className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
            key={medicine.id}
          >
            <div className="flex items-center justify-between">
              <h1 className="font-semibold text-gray-600">{medicine.name}</h1>
              <span className="text-gray-300 text-xs">Qty: {medicine.quantity}</span>
            </div>
            <p className="mt-2 text-gray-400 text-sm">Expires on: {medicine.expiryDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCalendar;
