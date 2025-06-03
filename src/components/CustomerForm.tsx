// src/components/ui/CustomerForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface CustomerData {
  id?: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  notes?: string;
}

type CustomerFormProps = {
  initialData?: CustomerData;
};

export default function CustomerForm({ initialData }: CustomerFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const idFromParams = searchParams.get("id") || ""; // not used if we pass initialData

  // Nếu có initialData (trường hợp edit), pre-fill, ngược lại để rỗng
  const [name, setName] = useState(initialData?.name || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [address, setAddress] = useState(initialData?.address || "");
  const [notes, setNotes] = useState(initialData?.notes || "");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Khi dùng cho “Edit”, chúng ta phải fetch lại data nếu trang được tải trực tiếp (nhưng ở ví dụ này, chúng ta pass initialData từ server)
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPhone(initialData.phone);
      setEmail(initialData.email);
      setAddress(initialData.address);
      setNotes(initialData.notes || "");
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !phone.trim() || !email.trim() || !address.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        notes: notes.trim() || undefined,
      };

      // Xác định xem là Add mới (POST) hay Edit (PUT) dựa vào initialData?.id
      let res;
      if (initialData && initialData.id) {
        // PUT /api/customers/[id]
        res = await fetch(`/api/customers/${initialData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // POST /api/customers
        res = await fetch("/api/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        if (data.errors) {
          setError(data.errors.map((err: any) => err.message).join(" "));
        } else if (data.error) {
          setError(data.error);
        } else {
          setError("Failed to save customer.");
        }
        setIsLoading(false);
        return;
      }

      // Nếu thêm mới: redirect về /dashboard/customers
      // Nếu edit: cũng redirect về /dashboard/customers/[id]
      const saved = await res.json();
      setIsLoading(false);

      if (initialData && initialData.id) {
        router.push(`/dashboard/customers/${initialData.id}`);
      } else {
        router.push("/dashboard/customers");
      }
    } catch {
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">
        {initialData ? "Edit Customer" : "New Customer"}
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block mb-1 text-gray-200">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block mb-1 text-gray-200">
            Phone
          </label>
          <input
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block mb-1 text-gray-200">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block mb-1 text-gray-200">
            Address
          </label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block mb-1 text-gray-200">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition"
        >
          {isLoading
            ? initialData
              ? "Saving..."
              : "Creating..."
            : initialData
            ? "Save Changes"
            : "Create Customer"}
        </button>
      </form>
    </div>
  );
}
