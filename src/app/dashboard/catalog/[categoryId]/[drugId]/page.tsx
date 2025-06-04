// src/app/dashboard/catalog/[categoryId]/[drugId]/page.tsx

import DrugForm from "@/components/DrugForm";

interface Params {
  params: { categoryId: string; drugId: string };
}

export default function DrugDetailPage({ params }: Params) {
  return <DrugForm categoryId={params.categoryId} drugId={params.drugId} />;
}