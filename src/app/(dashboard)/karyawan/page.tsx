'use client';

import { useState, useEffect } from 'react';

type Karyawan = {
  id: number;
  nama: string;
  nip: string;
  nik: string;
};

export default function KaryawanPage() {
  const [karyawanList, setKaryawanList] = useState<Karyawan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchKaryawan = async () => {
      try {
        const response = await fetch('/api/karyawan');
        const data: Karyawan[] = await response.json();
        setKaryawanList(data);
      } catch (error) {
        console.error("Gagal mengambil data karyawan:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchKaryawan();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manajemen Karyawan</h1>
        <button className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 transition-colors">
          + Tambah Karyawan
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {isLoading ? (
          <p>Memuat data...</p>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left font-semibold text-gray-600">Nama</th>
                <th className="p-4 text-left font-semibold text-gray-600">NIP</th>
                <th className="p-4 text-left font-semibold text-gray-600">NIK</th>
                <th className="p-4 text-left font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {karyawanList.map((karyawan) => (
                <tr key={karyawan.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{karyawan.nama}</td>
                  <td className="p-4">{karyawan.nip}</td>
                  <td className="p-4">{karyawan.nik}</td>
                  <td className="p-4">
                    <button className="text-yellow-500 hover:underline mr-4">Edit</button>
                    <button className="text-red-500 hover:underline">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}