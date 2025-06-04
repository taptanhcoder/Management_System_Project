// src/app/dashboard/catalog/[categoryId]/page.tsx

import CategoryDetail from "@/components/CategoryDetail";

interface Params {
  params: { categoryId: string };
}

export default function CategoryDetailPage({ params }: Params) {
  return <CategoryDetail id={params.categoryId} />;
}
