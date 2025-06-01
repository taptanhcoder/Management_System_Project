// src/components/CustomerForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface CustomerFormProps {
  id?: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
}

const CustomerForm = ({ id }: CustomerFormProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (id) {
      // TODO: GET /api/customers/{id}
      const mock: Customer = {
        id,
        name: "Alice Brown",
        phone: "123-456-7890",
        email: "alice@example.com",
        address: "123 Main St",
        notes: "VIP customer",
      };
      setName(mock.name);
      setPhone(mock.phone);
      setEmail(mock.email);
      setAddress(mock.address);
      setNotes(mock.notes);
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name, phone, email, address, notes };
    if (id) {
      // TODO: PUT /api/customers/{id}
      alert(`Updated customer ${id} (demo)`);
    } else {
      // TODO: POST /api/customers
      alert("Created new customer (demo)");
    }
    router.push("/dashboard/customers");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {id ? "Edit Customer" : "New Customer"}
        </h1>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-200 text-sm mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 text-sm mb-1">
              Phone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 text-sm mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 text-sm mb-1">
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 text-sm mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-white"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md"
            >
              {id ? "Update Customer" : "Create Customer"}
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

export default CustomerForm;
