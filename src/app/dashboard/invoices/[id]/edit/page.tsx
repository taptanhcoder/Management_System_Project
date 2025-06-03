// src/app/dashboard/invoices/[id]/edit/page.tsx
import { prisma } from "@/lib/prisma";
import InvoiceForm from "@/components/InvoiceForm";

interface EditPageProps {
  params: { id: string };
}

export default async function EditInvoicePage({ params }: EditPageProps) {
  const { id } = params;

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      items: {
        select: {
          id: true,
          drugId: true,
          quantity: true,
          unitPrice: true,
        },
      },
    },
  });

  if (!invoice) {
    return (
      <div className="px-6 py-8 text-red-400">
        Invoice with ID {id} not found.
      </div>
    );
  }

  // Chuẩn bị dữ liệu để pre-fill form
  const initialData = {
    id: invoice.id,
    customerId: invoice.customerId,
    date: invoice.date.toISOString().slice(0, 10), // YYYY-MM-DD
    status: invoice.status as "PAID" | "UNPAID",
    items: invoice.items.map((it) => ({
      id: it.id,
      drugId: it.drugId,
      quantity: it.quantity,
      unitPrice: it.unitPrice,
    })),
  };

  return <InvoiceForm initialData={initialData} />;
}
