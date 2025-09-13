import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Selamat Datang di Aplikasi Penggajian</h1>
      <Link href="/karyawan" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
        Masuk Dashboard
      </Link>
    </main>
  );
}
