// src/components/DeleteCustomerButton.tsx
"use client";

import { useRouter } from "next/navigation";
import React from "react";

interface DeleteCustomerButtonProps {
  customerId: string;
}

export default function DeleteCustomerButton({
  customerId,
}: DeleteCustomerButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Delete this customer?")) return;
    try {
      const res = await fetch(`/api/customers/${customerId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        alert("Failed to delete customer.");
        return;
      }
      router.push("/dashboard/customers");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Network error. Please try again.");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
    >
      Delete
    </button>
  );
}
