// src/app/dashboard/catalog/[categoryId]/new-drug.tsx

import DrugForm from "@/components/DrugForm";

interface Params {
  params: { categoryId: string };
}

export default function NewDrugPage({ params }: Params) {
  return <DrugForm categoryId={params.categoryId} />;
}