// src/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Aplikasi Penggajian Karyawan
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Selamat datang di sistem manajemen penggajian.
        </p>
        <Link 
          href="/karyawan" 
          className="px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 transition-colors"
        >
          Masuk ke Dashboard
        </Link>
      </div>
    </main>
  );
}