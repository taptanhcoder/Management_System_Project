// src/components/DashboardCard.tsx
import Link from "next/link";
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

type DashboardCardProps = {
  title: string;
  value: string;
  icon: ReactNode;
  action: string;
  bgClass?: string;   // e.g. "bg-green-100", "bg-yellow-100", etc.
  href?: string;      // if provided, wraps card in a Link
};

const DashboardCard = ({
  title,
  value,
  icon,
  action,
  bgClass = "bg-white",
  href,
}: DashboardCardProps) => {
  const cardBody = (
    <Card className={`${bgClass} shadow-md hover:shadow-lg transition`}>
      <CardContent className="p-6 min-h-[200px] flex flex-col justify-between h-full">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-800 dark:text-white">{title}</span>
          {icon}
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
        <div className="mt-2">
          <span className="text-sm text-blue-600 hover:underline">{action} →</span>
        </div>
      </CardContent>
    </Card>
  );

  return href ? (
    <Link href={href}>{cardBody}</Link>
  ) : (
    cardBody
  );
};

export default DashboardCard;
