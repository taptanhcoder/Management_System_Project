// src/app/dashboard/customers/[id]/edit/page.tsx
import { prisma } from "@/lib/prisma";
import CustomerForm from "@/components/CustomerForm";

interface EditPageProps {
  params: { id: string };
}

export default async function EditCustomerPage({ params }: EditPageProps) {
  const { id } = params;
  const customer = await prisma.customer.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      address: true,
      notes: true,
    },
  });

  if (!customer) {
    return (
      <div className="px-6 py-8 text-red-400">
        Customer with ID {id} not found.
      </div>
    );
  }

  const initialData = {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
    address: customer.address,
    notes: customer.notes || "",
  };

  return <CustomerForm initialData={initialData} />;
}
