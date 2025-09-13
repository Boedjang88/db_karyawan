"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/karyawan", label: "Karyawan" },
  { href: "/golongan", label: "Golongan" },
  { href: "/penggajian", label: "Penggajian" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 h-screen bg-white shadow-lg fixed">
      <div className="p-4 text-xl font-bold">Dashboard</div>
      <nav className="flex flex-col">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2 hover:bg-blue-100 ${
              pathname === link.href ? "bg-blue-200 font-semibold" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
