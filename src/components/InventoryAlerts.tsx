// src/components/InventoryAlerts.tsx
"use client";

import { useState, useEffect } from "react";

interface DrugAlert {
  id: string;
  name: string;
  quantity?: number;
  expiryDate?: string;
}

interface Alerts {
  lowStock: DrugAlert[];
  expiringSoon: DrugAlert[];
  expired: DrugAlert[];
}

const InventoryAlerts = () => {
  const [alerts, setAlerts] = useState<Alerts | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await fetch("/api/inventory/alerts");
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Cannot fetch alerts");
        }
        const data: Alerts = await res.json();
        setAlerts(data);
      } catch (e: any) {
        console.error(e);
        setError(e.message);
      }
    }
    fetchAlerts();
  }, []);

  if (error) {
    return <div className="text-red-600 p-4">Error: {error}</div>;
  }
  if (!alerts) {
    return <div className="p-4">Loading alerts...</div>;
  }

  return (
    <div className="space-y-4 p-4">
      {/* Low Stock */}
      {alerts.lowStock.length > 0 && (
        <div className="bg-yellow-100 dark:bg-yellow-900 rounded p-4">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            Low Stock Drugs
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            {alerts.lowStock.map((d) => (
              <li key={d.id} className="text-yellow-800 dark:text-yellow-200">
                {d.name} (Qty: {d.quantity})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Expiring Soon */}
      {alerts.expiringSoon.length > 0 && (
        <div className="bg-orange-100 dark:bg-orange-900 rounded p-4">
          <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-2">
            Expiring Soon
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            {alerts.expiringSoon.map((d) => (
              <li key={d.id} className="text-orange-800 dark:text-orange-200">
                {d.name} (Expiry:{" "}
                {new Date(d.expiryDate!).toLocaleDateString("en-GB")})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Expired */}
      {alerts.expired.length > 0 && (
        <div className="bg-red-100 dark:bg-red-900 rounded p-4">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            Expired Drugs
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            {alerts.expired.map((d) => (
              <li key={d.id} className="text-red-800 dark:text-red-200">
                {d.name} (Expired:{" "}
                {new Date(d.expiryDate!).toLocaleDateString("en-GB")})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default InventoryAlerts;
