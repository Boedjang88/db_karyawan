'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const menuItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dashboard/karyawan', label: 'Karyawan' },
    { href: '/dashboard/golongan', label: 'Golongan' },
    { href: '/dashboard/lembur', label: 'Lembur' },
    { href: '/dashboard/cuti', label: 'Cuti' },
    { href: '/dashboard/penggajian', label: 'Penggajian' },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col">
      <div className="mb-6 font-bold text-xl">Payroll App</div>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.href} className="mb-2">
              <Link
                href={item.href}
                className={`block p-2 rounded transition-colors ${
                  pathname === item.href ? 'bg-sky-500' : 'hover:bg-gray-700'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}