// src/app/(dashboard)/karyawan/page.tsx
'use client';

import { useState, useEffect, FormEvent, useCallback } from 'react';

// Tipe data didefinisikan di sini
interface Golongan {
  id: number;
  nama_golongan: string;
}
interface Karyawan {
  id: number;
  nip: string;
  nik: string;
  nama: string;
  jenis_kelamin: 'pria' | 'wanita';
  tempat_lahir: string;
  tanggal_lahir: string;
  telpon: string;
  agama: string;
  status_nikah: 'belum_nikah' | 'nikah';
  alamat: string;
  foto: string;
  golongan_id: number;
  golongan?: Golongan;
}
type EditingKaryawan = Omit<Karyawan, 'golongan'>;

export default function KaryawanPage() {
  const [karyawanList, setKaryawanList] = useState<Karyawan[]>([]);
  const [golonganList, setGolonganList] = useState<Golongan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk form tambah
  const [formData, setFormData] = useState({
    nama: '', nip: '', nik: '', jenis_kelamin: 'pria' as 'pria' | 'wanita', tempat_lahir: '', tanggal_lahir: '', telpon: '', agama: '', status_nikah: 'belum_nikah' as 'belum_nikah' | 'nikah', alamat: '', foto: 'default.jpg', golongan_id: 0
  });

  // State untuk modal edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKaryawan, setEditingKaryawan] = useState<EditingKaryawan | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const [karyawanRes, golonganRes] = await Promise.all([
      fetch('/api/karyawan'),
      fetch('/api/golongan')
    ]);
    const karyawanData = await karyawanRes.json();
    const golonganData = await golonganRes.json();
    setKaryawanList(karyawanData);
    setGolonganList(golonganData);
    if (golonganData.length > 0) {
      setFormData(prev => ({ ...prev, golongan_id: golonganData[0].id }));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fungsi ini sekarang akan digunakan di form tambah
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await fetch('/api/karyawan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        golongan_id: Number(formData.golongan_id),
        tanggal_lahir: new Date(formData.tanggal_lahir),
      }),
    });
    // Reset form ke nilai awal
    setFormData({ nama: '', nip: '', nik: '', jenis_kelamin: 'pria', tempat_lahir: '', tanggal_lahir: '', telpon: '', agama: '', status_nikah: 'belum_nikah', alamat: '', foto: 'default.jpg', golongan_id: golonganList[0]?.id || 0 });
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menghapus data ini?')) {
      await fetch(`/api/karyawan/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  const handleEditClick = (karyawan: Karyawan) => {
    setEditingKaryawan({ ...karyawan, tanggal_lahir: new Date(karyawan.tanggal_lahir).toISOString().split('T')[0] });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingKaryawan(null);
  };

  const handleUpdateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingKaryawan) return;
    await fetch(`/api/karyawan/${editingKaryawan.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...editingKaryawan,
        golongan_id: Number(editingKaryawan.golongan_id),
        tanggal_lahir: new Date(editingKaryawan.tanggal_lahir),
      }),
    });
    handleModalClose();
    fetchData();
  };

  if (isLoading) return <p>Memuat data...</p>;

  return (
    <>
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Manajemen Karyawan</h1>
            {/* Tombol ini sekarang tidak melakukan apa-apa karena form ada di bawah */}
        </div>


        {/* Form Tambah Data */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-black">Tambah Karyawan Baru</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="nama" value={formData.nama} onChange={handleChange} placeholder="Nama" required className="p-2 border rounded text-black" />
                <input name="nip" value={formData.nip} onChange={handleChange} placeholder="NIP" required className="p-2 border rounded text-black" />
                {/* Tambahkan input lain di sini dengan onChange={handleChange} */}
            </div>
            <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-md">Simpan</button>
          </form>
        </div>

        {/* Tabel Data */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Nama</th>
                <th className="p-4 text-left">NIP</th>
                <th className="p-4 text-left">Golongan</th>
                <th className="p-4 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-black">
              {karyawanList.map((k) => (
                <tr key={k.id}>
                  <td className="p-4">{k.nama}</td>
                  <td className="p-4">{k.nip}</td>
                  <td className="p-4">{k.golongan?.nama_golongan || '-'}</td>
                  <td className="p-4 space-x-2">
                    <button onClick={() => handleEditClick(k)} className="text-yellow-600">Edit</button>
                    <button onClick={() => handleDelete(k.id)} className="text-red-600">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Edit */}
      {isModalOpen && editingKaryawan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl">
            <h2 className="text-2xl font-bold mb-6 text-black">Edit Karyawan</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
                {/* Tambahkan input untuk edit di sini */}
                <div className="flex justify-end space-x-4">
                  <button type="button" onClick={handleModalClose} className="px-4 py-2 bg-gray-300 rounded-md">Batal</button>
                  <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-md">Simpan Perubahan</button>
                </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}