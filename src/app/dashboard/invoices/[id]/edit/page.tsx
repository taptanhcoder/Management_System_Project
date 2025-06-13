// src/app/dashboard/invoices/[id]/edit/page.tsx
import InvoiceForm from "@/components/InvoiceForm";
import { prisma } from "@/lib/prisma";

export default async function EditInvoicePage({ params }: { params: { id: string } }) {
  const inv = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: { items: true },
  });
  if (!inv) {
    return <p className="p-6 text-red-400">Invoice not found.</p>;
  }

  const initialData = {
    id: inv.id,
    customerId: inv.customerId!,
    date: inv.date.toISOString().slice(0, 10),
    status: inv.status,
    items: inv.items.map((it) => ({
      drugId: it.drugId,
      quantity: it.quantity,
      unitPrice: it.unitPrice,
    })),
  };

  return <InvoiceForm initialData={initialData} />;
}
