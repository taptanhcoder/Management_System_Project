// src/app/dashboard/customers/[id]/page.tsx
import CustomerDetail from "@/components/CustomerDetail";

interface PageProps {
  params: { id: string };
}

export default function CustomerDetailPage({ params }: PageProps) {
  return <CustomerDetail params={params} />;
}
