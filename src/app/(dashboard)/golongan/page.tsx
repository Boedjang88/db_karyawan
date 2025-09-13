// src/app/(dashboard)/golongan/page.tsx
'use client';

import { useState, useEffect, FormEvent, useCallback } from 'react';

// Definisikan tipe data untuk Golongan
interface Golongan {
  id: number;
  nama_golongan: string;
  gaji_pokok: number;
  tunjangan_istri: number;
  tunjangan_anak: number;
  tunjangan_transport: number;
  tunjangan_makan: number;
}

// Tipe data untuk form, semua nilai bisa berupa string saat diinput
type GolonganFormData = Omit<Golongan, 'id'>;

export default function GolonganPage() {
  const [golonganList, setGolonganList] = useState<Golongan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk form tambah data
  const [formData, setFormData] = useState<GolonganFormData>({
    nama_golongan: '',
    gaji_pokok: 0,
    tunjangan_istri: 0,
    tunjangan_anak: 0,
    tunjangan_transport: 0,
    tunjangan_makan: 0,
  });

  // State untuk modal edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGolongan, setEditingGolongan] = useState<Golongan | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/golongan');
      const data = await response.json();
      setGolonganList(data);
    } catch (error) {
      console.error("Gagal mengambil data golongan:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await fetch('/api/golongan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        // Konversi ke Number sebelum dikirim
        gaji_pokok: Number(formData.gaji_pokok),
        tunjangan_istri: Number(formData.tunjangan_istri),
        tunjangan_anak: Number(formData.tunjangan_anak),
        tunjangan_transport: Number(formData.tunjangan_transport),
        tunjangan_makan: Number(formData.tunjangan_makan),
      }),
    });
    // Reset form
    setFormData({ nama_golongan: '', gaji_pokok: 0, tunjangan_istri: 0, tunjangan_anak: 0, tunjangan_transport: 0, tunjangan_makan: 0 });
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus golongan ini?')) {
      await fetch(`/api/golongan/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  const handleEditClick = (golongan: Golongan) => {
    setEditingGolongan(golongan);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingGolongan(null);
  };

  const handleUpdateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingGolongan) return;
    
    await fetch(`/api/golongan/${editingGolongan.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...editingGolongan,
         // Konversi ke Number sebelum dikirim
        gaji_pokok: Number(editingGolongan.gaji_pokok),
        tunjangan_istri: Number(editingGolongan.tunjangan_istri),
        tunjangan_anak: Number(editingGolongan.tunjangan_anak),
        tunjangan_transport: Number(editingGolongan.tunjangan_transport),
        tunjangan_makan: Number(editingGolongan.tunjangan_makan),
      }),
    });
    handleModalClose();
    fetchData();
  };

  if (isLoading) return <p className="text-center mt-4">Memuat data...</p>;

  return (
    <>
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Manajemen Golongan</h1>

        {/* Form Tambah Golongan */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-black">Tambah Golongan Baru</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input name="nama_golongan" value={formData.nama_golongan} onChange={handleChange} placeholder="Nama Golongan" required className="p-2 border rounded text-black" />
            <input name="gaji_pokok" type="number" value={formData.gaji_pokok} onChange={handleChange} placeholder="Gaji Pokok" required className="p-2 border rounded text-black" />
            <input name="tunjangan_istri" type="number" value={formData.tunjangan_istri} onChange={handleChange} placeholder="Tunj. Istri" required className="p-2 border rounded text-black" />
            <input name="tunjangan_anak" type="number" value={formData.tunjangan_anak} onChange={handleChange} placeholder="Tunj. Anak" required className="p-2 border rounded text-black" />
            <input name="tunjangan_transport" type="number" value={formData.tunjangan_transport} onChange={handleChange} placeholder="Tunj. Transport" required className="p-2 border rounded text-black" />
            <input name="tunjangan_makan" type="number" value={formData.tunjangan_makan} onChange={handleChange} placeholder="Tunj. Makan" required className="p-2 border rounded text-black" />
            <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-md col-span-full md:col-span-1">Simpan</button>
          </form>
        </div>

        {/* Tabel Data Golongan */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Nama Golongan</th>
                <th className="p-4 text-left">Gaji Pokok</th>
                <th className="p-4 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-black">
              {golonganList.map((g) => (
                <tr key={g.id}>
                  <td className="p-4">{g.nama_golongan}</td>
                  <td className="p-4">{g.gaji_pokok.toLocaleString('id-ID')}</td>
                  <td className="p-4 space-x-4">
                    <button onClick={() => handleEditClick(g)} className="text-yellow-600">Edit</button>
                    <button onClick={() => handleDelete(g.id)} className="text-red-600">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal untuk Edit */}
      {isModalOpen && editingGolongan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4 text-black">Edit Golongan</h2>
            <form onSubmit={handleUpdateSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="nama_golongan" value={editingGolongan.nama_golongan} onChange={(e) => setEditingGolongan({...editingGolongan, nama_golongan: e.target.value})} placeholder="Nama Golongan" required className="p-2 border rounded text-black" />
              <input name="gaji_pokok" type="number" value={editingGolongan.gaji_pokok} onChange={(e) => setEditingGolongan({...editingGolongan, gaji_pokok: Number(e.target.value)})} placeholder="Gaji Pokok" required className="p-2 border rounded text-black" />
              <input name="tunjangan_istri" type="number" value={editingGolongan.tunjangan_istri} onChange={(e) => setEditingGolongan({...editingGolongan, tunjangan_istri: Number(e.target.value)})} placeholder="Tunj. Istri" required className="p-2 border rounded text-black" />
              <input name="tunjangan_anak" type="number" value={editingGolongan.tunjangan_anak} onChange={(e) => setEditingGolongan({...editingGolongan, tunjangan_anak: Number(e.target.value)})} placeholder="Tunj. Anak" required className="p-2 border rounded text-black" />
              <input name="tunjangan_transport" type="number" value={editingGolongan.tunjangan_transport} onChange={(e) => setEditingGolongan({...editingGolongan, tunjangan_transport: Number(e.target.value)})} placeholder="Tunj. Transport" required className="p-2 border rounded text-black" />
              <input name="tunjangan_makan" type="number" value={editingGolongan.tunjangan_makan} onChange={(e) => setEditingGolongan({...editingGolongan, tunjangan_makan: Number(e.target.value)})} placeholder="Tunj. Makan" required className="p-2 border rounded text-black" />
              <div className="flex justify-end space-x-4 col-span-full">
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