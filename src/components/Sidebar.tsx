// src/components/dashboard/Sidebar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const menuItems = [
    { href: '/karyawan', label: 'Karyawan' },
    { href: '/golongan', label: 'Golongan' },
    { href: '/lembur', label: 'Lembur' },
    { href: '/cuti', label: 'Cuti' },
    { href: '/penggajian', label: 'Penggajian' },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col">
      <div className="mb-6 font-bold text-xl text-center">Aplikasi Gaji</div>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
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