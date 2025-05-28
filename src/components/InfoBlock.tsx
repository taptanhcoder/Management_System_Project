type InfoBlockProps = {
  title: string;
  rightLabel?: string;
  items: {
    value: string;
    label: string;
  }[];
  link?: {
    href: string;
    text: string;
  };
};

const InfoBlock = ({ title, rightLabel, items, link }: InfoBlockProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 min-h-[250px] flex flex-col justify-between">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-300 dark:border-gray-600 pb-2 mb-4">
        <span className="text-sm font-semibold text-gray-800 dark:text-white">{title}</span>
        {link ? (
          <a href={link.href} className="text-blue-600 text-sm hover:underline">
            {link.text} →
          </a>
        ) : (
          <span className="text-gray-500 text-xs">{rightLabel}</span>
        )}
      </div>

      {/* Body */}
      <div className="flex justify-between">
        {items.map((item, idx) => (
          <div key={idx}>
            <div className="text-xl font-semibold text-gray-900 dark:text-white">
              {item.value}
            </div>
            <div className="text-sm text-gray-500">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoBlock;
