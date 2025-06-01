"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

const samplePrescription = {
  id: "RX001",
  customer: "Nguyễn Văn A",
  date: "2025-05-25",
  total: 150000,
  status: "Confirmed",
  medicines: [
    { name: "Paracetamol 500mg", quantity: 10, price: 5000 },
    { name: "Vitamin C 1000mg", quantity: 5, price: 10000 },
  ],
};

const PrescriptionDetailPage = () => {
  const router = useRouter();
  const rx = samplePrescription;

  // Hàm xóa (demo)
  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete prescription ${rx.id}?`)) {
      // TODO: gọi API xóa thực tế ở đây
      alert(`Prescription ${rx.id} deleted! (demo)`);
      router.push("/dashboard/prescriptions");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 dark:text-gray-400">
        <ol className="list-reset flex space-x-2">
          <li>
            <Link href="/dashboard/prescriptions" className="hover:underline">
              Prescriptions
            </Link>
            <span className="mx-2">{">"}</span>
          </li>
          <li>
            <Link href="/dashboard/prescriptions" className="hover:underline">
              List of Prescriptions
            </Link>
            <span className="mx-2">{">"}</span>
          </li>
          <li aria-current="page" className="font-semibold text-gray-900 dark:text-white">
            Prescription {rx.id}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex justify-between items-center gap-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Prescription Detail</h1>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/prescriptions/${rx.id}/edit`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md transition"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-2">
        <h2 className="text-xl font-semibold">Customer Information</h2>
        <p><strong>Name:</strong> {rx.customer}</p>
        <p><strong>Date:</strong> {new Date(rx.date).toLocaleDateString()}</p>
        <p>
          <strong>Status:</strong>
          <span
            className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
              rx.status === "Confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {rx.status}
          </span>
        </p>
        <p><strong>Total:</strong> {rx.total.toLocaleString()} đ</p>
      </div>

      {/* Medicines List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Medicines</h2>
        <table className="min-w-full text-left text-sm text-gray-700 dark:text-gray-300 border-collapse border border-gray-300 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">Name</th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">Quantity</th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">Price per unit</th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {rx.medicines.map((med, idx) => (
              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{med.name}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{med.quantity}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{med.price.toLocaleString()} đ</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{(med.price * med.quantity).toLocaleString()} đ</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Back button */}
      <Link href="/dashboard/prescriptions" className="inline-block text-blue-600 hover:underline mt-4">
        &larr; Back to List of Prescriptions
      </Link>
    </div>
  );
};

export default PrescriptionDetailPage;
