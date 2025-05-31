"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Medicine = {
  name: string;
  quantity: number;
  unitPrice: number;
};

type Prescription = {
  customer: string;
  date: string;
  status: "Pending" | "Confirmed";
  medicines: Medicine[];
};

const AddPrescriptionPage = () => {
  const router = useRouter();

  const [prescription, setPrescription] = useState<Prescription>({
    customer: "",
    date: new Date().toISOString().split("T")[0], // ngày hiện tại theo định dạng yyyy-mm-dd
    status: "Pending",
    medicines: [{ name: "", quantity: 1, unitPrice: 0 }],
  });

  const updateField = (field: keyof Prescription, value: any) => {
    setPrescription({ ...prescription, [field]: value });
  };

  const updateMedicine = (index: number, field: keyof Medicine, value: any) => {
    const newMedicines = [...prescription.medicines];
    newMedicines[index] = { ...newMedicines[index], [field]: value };
    setPrescription({ ...prescription, medicines: newMedicines });
  };

  const addMedicine = () => {
    setPrescription({
      ...prescription,
      medicines: [...prescription.medicines, { name: "", quantity: 1, unitPrice: 0 }],
    });
  };

  const removeMedicine = (index: number) => {
    const newMedicines = prescription.medicines.filter((_, i) => i !== index);
    setPrescription({ ...prescription, medicines: newMedicines });
  };

  const totalAmount = prescription.medicines.reduce(
    (sum, med) => sum + med.quantity * med.unitPrice,
    0
  );

  const handleSave = () => {
    // TODO: gọi API tạo mới đơn ở đây
    console.log("Adding prescription:", prescription);
    alert("Prescription added! (demo)");
    router.push("/dashboard/prescriptions");
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
          <li aria-current="page" className="font-semibold text-gray-900 dark:text-white">
            Add New Prescription
          </li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Prescription</h1>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6"
        noValidate
      >
        {/* Customer */}
        <div>
          <label
            htmlFor="customer"
            className="block mb-1 font-semibold text-gray-700 dark:text-gray-300"
          >
            Customer
          </label>
          <input
            id="customer"
            name="customer"
            type="text"
            value={prescription.customer}
            onChange={(e) => updateField("customer", e.target.value)}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label
            htmlFor="date"
            className="block mb-1 font-semibold text-gray-700 dark:text-gray-300"
          >
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            value={prescription.date}
            onChange={(e) => updateField("date", e.target.value)}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="block mb-1 font-semibold text-gray-700 dark:text-gray-300"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={prescription.status}
            onChange={(e) => updateField("status", e.target.value as "Pending" | "Confirmed")}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
          </select>
        </div>

        {/* Medicines */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
            Medicines
          </label>
          {prescription.medicines.map((med, i) => (
            <div key={i} className="flex gap-2 mb-3 items-center flex-wrap">
              <input
                type="text"
                aria-label={`Medicine name ${i + 1}`}
                placeholder="Medicine name"
                value={med.name}
                onChange={(e) => updateMedicine(i, "name", e.target.value)}
                className="flex-1 min-w-[150px] px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <input
                type="number"
                min={1}
                aria-label={`Quantity for medicine ${i + 1}`}
                placeholder="Quantity"
                value={med.quantity}
                onChange={(e) => updateMedicine(i, "quantity", parseInt(e.target.value) || 1)}
                className="w-20 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <input
                type="number"
                min={0}
                aria-label={`Unit price for medicine ${i + 1}`}
                placeholder="Unit Price"
                value={med.unitPrice}
                onChange={(e) => updateMedicine(i, "unitPrice", parseInt(e.target.value) || 0)}
                className="w-28 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <span className="w-32 text-right font-semibold select-none">
                {(med.quantity * med.unitPrice).toLocaleString()} đ
              </span>
              <button
                type="button"
                onClick={() => removeMedicine(i)}
                className="text-red-600 hover:underline whitespace-nowrap"
                aria-label={`Remove medicine ${med.name || i + 1}`}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addMedicine}
            className="mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md"
          >
            + Add Medicine
          </button>
        </div>

        {/* Total */}
        <div className="text-right font-bold text-lg select-none">
          Total Amount: {totalAmount.toLocaleString()} đ
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition"
          >
            Save
          </button>
          <Link
            href="/dashboard/prescriptions"
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold px-6 py-2 rounded-md transition flex items-center justify-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AddPrescriptionPage;
