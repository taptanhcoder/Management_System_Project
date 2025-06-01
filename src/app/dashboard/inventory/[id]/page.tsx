// src/app/dashboard/inventory/[id]/page.tsx
import InventoryDetail from "@/components/InventoryDetail";

interface Params {
  params: { id: string };
}

export default function InventoryDetailPage({ params }: Params) {
  return <InventoryDetail id={params.id} />;
}
