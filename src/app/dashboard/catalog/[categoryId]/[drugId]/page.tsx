// src/app/dashboard/catalog/[categoryId]/[drugId]/page.tsx
import DrugForm from "@/components/DrugForm";

interface Params {
  params: { categoryId: string; drugId: string };
}

export default function DrugDetailPage({ params }: Params) {
  // Nếu chỉ muốn hiển thị detail không edit, bạn có thể làm component riêng.
  return <DrugForm categoryId={params.categoryId} drugId={params.drugId} />;
}
