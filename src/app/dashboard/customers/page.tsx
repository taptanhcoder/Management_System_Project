// src/app/dashboard/customers/page.tsx
import CustomerList from "@/components/CustomerList";

interface CustomersPageProps {
  searchParams: { q?: string };
}

export default function CustomersPage({ searchParams }: CustomersPageProps) {
  // Lấy param "q" từ URL (nếu có)
  const searchQuery = searchParams.q || "";

  return <CustomerList searchQuery={searchQuery} />;
}
