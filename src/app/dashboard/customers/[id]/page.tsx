// src/app/dashboard/customers/[id]/page.tsx
import CustomerDetail from "@/components/CustomerDetail";

interface Params {
  params: { id: string };
}

export default function CustomerDetailPage({ params }: Params) {
  return <CustomerDetail id={params.id} />;
}
