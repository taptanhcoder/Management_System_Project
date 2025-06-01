// src/components/InfoBlock.tsx
import Link from "next/link";

interface InfoBlockItem {
  value: string;
  label: string;
}

interface InfoBlockProps {
  title: string;
  rightLabel?: string;
  items: InfoBlockItem[];
  link?: {
    href: string;
    text: string;
  };
}

const InfoBlock = ({ title, rightLabel, items, link }: InfoBlockProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-300 dark:border-gray-600 pb-2 mb-4">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white">{title}</h3>
        <div className="flex items-center gap-2">
          {rightLabel && (
            <span className="text-gray-500 dark:text-gray-400 text-xs">{rightLabel}</span>
          )}
          {link && (
            <Link href={link.href} legacyBehavior>
              <a className="text-blue-600 text-sm hover:underline">
                {link.text} →
              </a>
            </Link>
          )}
        </div>
      </div>

      {/* Body: grid of items */}
      <div className="grid grid-cols-2 gap-4">
        {items.map((item, idx) => (
          <div key={idx}>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              {item.value}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoBlock;
