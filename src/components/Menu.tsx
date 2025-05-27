import Image from "next/image";
import Link from "next/link";

type MenuProps = {
  collapsed: boolean;
};

const menuItems = [
  {
    title: "OVERVIEW",
    items: [
      { icon: "/dashboard.png", label: "Dashboard", href: "/dashboard/admin" },
      { icon: "/prescription.png", label: "Prescriptions", href: "/prescriptions" },
    ],
  },
  {
    title: "INVENTORY",
    items: [
      { icon: "/inventory.png", label: "Stock Overview", href: "/inventory" },
      { icon: "/import.png", label: "Import Stock", href: "/inventory/import" },
      { icon: "/export.png", label: "Export Stock", href: "/inventory/export" },
      { icon: "/expiry.png", label: "Expiration Alerts", href: "/alerts" },
      { icon: "/catalog.png", label: "Drug Catalog", href: "/catalog" },
    ],
  },
  {
    title: "PARTNERS",
    items: [
      { icon: "/supplier.png", label: "Suppliers", href: "/suppliers" },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      { icon: "/profile.png", label: "My Profile", href: "/profile" },
      { icon: "/setting.png", label: "Settings", href: "/settings" },
      { icon: "/logout.png", label: "Logout", href: "/logout" },
    ],
  },
];


const Menu = ({ collapsed }: MenuProps) => {
  return (
    <nav className="flex flex-col gap-6 mt-6">
      {menuItems.map((group) => (
        <div key={group.title}>
          {!collapsed && (
            <h3 className="text-xs font-bold text-gray-500 mb-2 px-2 uppercase">{group.title}</h3>
          )}
          <ul className="flex flex-col gap-1">
            {group.items.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <Image src={item.icon} alt={item.label} width={20} height={20} />
                  {!collapsed && <span className="text-sm">{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
};

export default Menu;
