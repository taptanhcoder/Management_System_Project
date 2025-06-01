// src/components/EventCalendar.tsx
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Medicine {
  id: number;
  name: string;
  quantity: number;
  expiryDate: string; // format “YYYY-MM-DD”
}

const EventCalendar = () => {
  const [value, onChange] = useState<Date>(new Date());
  const [lowStockMedicines, setLowStockMedicines] = useState<Medicine[]>([]);
  const [expiryDates, setExpiryDates] = useState<string[]>([]);

  useEffect(() => {
    async function fetchLowStockData() {
      // TODO: Replace this mock with a real API call, e.g.:
      // const res = await fetch("/api/inventory/low-stock");
      // const data: Medicine[] = await res.json();
      const data: Medicine[] = [
        { id: 1, name: "Paracetamol 500mg", quantity: 3, expiryDate: "2025-06-20" },
        { id: 2, name: "Ibuprofen 200mg", quantity: 2, expiryDate: "2025-06-15" },
        { id: 3, name: "Vitamin C 1000mg", quantity: 4, expiryDate: "2025-07-01" },
      ];
      setLowStockMedicines(data);
      setExpiryDates(data.map((m) => m.expiryDate));
    }
    fetchLowStockData();
  }, []);

  // Highlight any calendar tile that matches an expiry date
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const isoDate = date.toISOString().slice(0, 10);
      if (expiryDates.includes(isoDate)) {
        return "bg-red-100 border-red-300"; // light red highlight
      }
    }
    return "";
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow">
      <Calendar
        onChange={(d) => onChange(d as Date)}
        value={value}
        className="mx-auto"
        tileClassName={tileClassName}
      />

      <div className="flex items-center justify-between mt-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Low Stock / Expiring Soon
        </h2>
        <Image src="/moreDark.png" alt="More options" width={20} height={20} />
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {lowStockMedicines.map((medicine) => (
          <div
            key={medicine.id}
            className="p-4 rounded-md border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200">
                {medicine.name}
              </h3>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                Qty: {medicine.quantity}
              </span>
            </div>
            <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
              Expires on: {medicine.expiryDate}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCalendar;
