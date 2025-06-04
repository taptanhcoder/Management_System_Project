// src/app/dashboard/catalog/[categoryId]/edit/page.tsx

import CategoryForm from "@/components/CategoryForm";

interface Params {
  params: { categoryId: string };
}

export default function EditCategoryPage({ params }: Params) {
  return <CategoryForm id={params.categoryId} />;
}