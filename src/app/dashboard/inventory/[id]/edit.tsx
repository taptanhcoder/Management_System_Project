// src/app/dashboard/inventory/[id]/edit.tsx
import InventoryForm from "@/components/InventoryForm";

interface Params {
  params: { id: string };
}

export default function EditInventoryPage({ params }: Params) {
  return <InventoryForm id={params.id} />;
}
