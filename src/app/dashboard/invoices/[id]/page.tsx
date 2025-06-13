// src/app/dashboard/invoices/[id]/page.tsx
import InvoiceDetail from "@/components/InvoiceDetail";

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  return <InvoiceDetail id={params.id} />;
}
