import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">Aplikasi Payroll</h1>
      <Link href="/dashboard" className="text-sky-500 hover:underline">
        Masuk ke Dashboard
      </Link>
    </main>
  );
}