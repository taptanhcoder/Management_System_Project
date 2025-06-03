// src/app/dashboard/invoices/[id]/page.tsx
import InvoiceDetail from "@/components/InvoiceDetail";

interface PageProps {
  params: { id: string };
}

export default function InvoiceDetailPage({ params }: PageProps) {
  return <InvoiceDetail params={params} />;
}
