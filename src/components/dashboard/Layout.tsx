// src/app/dashboard/layout.tsx
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from './TopBar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="ml-64 w-full">
        <Topbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}