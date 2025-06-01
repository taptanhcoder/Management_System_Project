// src/app/dashboard/prescriptions/[id]/edit.tsx
import PrescriptionForm from "@/components/PrescriptionForm";

interface Params {
  params: { id: string };
}

export default function EditPrescriptionPage({ params }: Params) {
  return <PrescriptionForm id={params.id} />;
}
