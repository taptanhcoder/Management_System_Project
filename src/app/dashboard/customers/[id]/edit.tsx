// src/app/dashboard/customers/[id]/edit.tsx
import CustomerForm from "@/components/CustomerForm";

interface Params {
  params: { id: string };
}

export default function EditCustomerPage({ params }: Params) {
  return <CustomerForm id={params.id} />;
}
