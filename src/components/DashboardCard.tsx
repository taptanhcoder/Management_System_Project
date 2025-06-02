import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

type DashboardCardProps = {
  title: string;
  value: string;
  icon: ReactNode;
  action: string;
  bg: string;
};

const DashboardCard = ({ title, value, icon, action, bg }: DashboardCardProps) => {
  return (
    <Card className={`${bg} shadow-md`}>
      <CardContent className="p-6 min-h-[200px] flex flex-col justify-between h-full">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-800 dark:text-white">{title}</div>
          {icon}
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
        <button className="text-sm text-blue-600 hover:underline">{action} →</button>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
