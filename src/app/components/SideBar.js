"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaTachometerAlt, FaTags, FaMoneyBill, FaTasks, FaStar, FaUsers } from 'react-icons/fa';

export default function Sidebar() {
  const pathname = usePathname();
  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: FaTachometerAlt },
    { name: 'Categories', href: '/admin/categories', icon: FaTags },
    { name: 'Payments', href: '/admin/payments', icon: FaMoneyBill },
    { name: 'Progress', href: '/admin/progress', icon: FaTasks },
    { name: 'Review', href: '/admin/review', icon: FaStar },
    { name: 'Users', href: '/admin/users', icon: FaUsers },
  ];

  return (
    <div className="w-64 h-full bg-gradient-to-b from-blue-800 to-blue-600 text-white shadow-lg">
      <div className="p-4 text-center font-bold text-xl border-b border-blue-700">
        Admin
      </div>
      <ul className="space-y-2 p-4">
        {menuItems.map((item) => (
          <li key={item.name}>
            <Link href={item.href} className={`flex items-center p-4 rounded transition-colors duration-200 ${
                  pathname === item.href
                    ? 'bg-blue-700'
                    : 'hover:bg-blue-700'
                }`}>
              <item.icon className="mr-3" />
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}