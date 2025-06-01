// src/app/dashboard/prescriptions/[id]/page.tsx
import PrescriptionDetail from "@/components/PrescriptionDetail";

interface Params {
  params: { id: string };
}

export default function PrescriptionDetailPage({ params }: Params) {
  return <PrescriptionDetail id={params.id} />;
}
