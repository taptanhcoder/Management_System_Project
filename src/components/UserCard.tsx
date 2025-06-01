// src/components/UserCard.tsx
import Image from "next/image";

interface UserCardProps {
  label: string;        // e.g. “Employees”, “Customers”
  count: number;
  period?: string;      // e.g. “2024/25”, “Q1 2025”
  bgColor?: string;     // e.g. "bg-blue-200", "bg-green-200"
}

const UserCard = ({
  label,
  count,
  period = "",
  bgColor = "bg-blue-200",
}: UserCardProps) => {
  return (
    <div className={`${bgColor} dark:bg-blue-700 p-4 rounded-2xl flex-1 min-w-[140px] shadow`}>
      <div className="flex justify-between items-center">
        {period && (
          <span className="text-[10px] bg-white dark:bg-gray-800 px-2 py-1 rounded-full text-gray-800 dark:text-gray-200">
            {period}
          </span>
        )}
        <Image src="/moreDark.png" alt="More options" width={20} height={20} />
      </div>
      <h3 className="text-2xl font-semibold my-4 text-gray-900 dark:text-white">
        {count.toLocaleString("en-US")}
      </h3>
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
    </div>
  );
};

export default UserCard;
