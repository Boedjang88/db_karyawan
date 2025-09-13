// src/app/(dashboard)/cuti/page.tsx
'use client';

import { useState, useEffect, FormEvent, useCallback } from 'react';

// Definisikan tipe data/interface
interface Karyawan {
  id: number;
  nama: string;
}
interface Cuti {
  id: number;
  tanggal_cuti: string;
  jumlah: number;
  karyawan_id: number;
  karyawan: Karyawan;
}

export default function CutiPage() {
  const [cutiList, setCutiList] = useState<Cuti[]>([]);
  const [karyawanList, setKaryawanList] = useState<Karyawan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk form tambah
  const [formData, setFormData] = useState({
    karyawan_id: '',
    tanggal_cuti: new Date().toISOString().split('T')[0],
    jumlah: '',
  });

  // State untuk modal edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCuti, setEditingCuti] = useState<Omit<Cuti, 'karyawan'> | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [cutiRes, karyawanRes] = await Promise.all([
        fetch('/api/cuti'),
        fetch('/api/karyawan'),
      ]);
      const cutiData = await cutiRes.json();
      const karyawanData = await karyawanRes.json();
      
      setCutiList(cutiData);
      setKaryawanList(karyawanData);

      if (karyawanData.length > 0 && !formData.karyawan_id) {
        setFormData(prev => ({ ...prev, karyawan_id: String(karyawanData[0].id) }));
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [formData.karyawan_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await fetch('/api/cuti', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setFormData(prev => ({ ...prev, jumlah: '' }));
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menghapus data cuti ini?')) {
      await fetch(`/api/cuti/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  const handleEditClick = (cuti: Cuti) => {
    setEditingCuti({
        id: cuti.id,
        karyawan_id: cuti.karyawan_id,
        tanggal_cuti: new Date(cuti.tanggal_cuti).toISOString().split('T')[0],
        jumlah: cuti.jumlah
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCuti(null);
  };

  const handleUpdateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingCuti) return;
    
    await fetch(`/api/cuti/${editingCuti.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingCuti),
    });
    handleModalClose();
    fetchData();
  };

  if (isLoading) return <p className="text-center mt-4">Memuat data...</p>;

  return (
    <>
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Manajemen Cuti</h1>

        {/* Form Tambah Cuti */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-black">Tambah Data Cuti</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
                <label htmlFor="karyawan_id" className="block text-sm font-medium text-gray-700">Karyawan</label>
                <select id="karyawan_id" name="karyawan_id" value={formData.karyawan_id} onChange={handleChange} className="mt-1 p-2 border rounded w-full text-black" required>
                    {karyawanList.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
                </select>
            </div>
             <div>
                <label htmlFor="tanggal_cuti" className="block text-sm font-medium text-gray-700">Tanggal Cuti</label>
                <input id="tanggal_cuti" name="tanggal_cuti" type="date" value={formData.tanggal_cuti} onChange={handleChange} required className="mt-1 p-2 border rounded w-full text-black" />
            </div>
            <div>
                <label htmlFor="jumlah" className="block text-sm font-medium text-gray-700">Jumlah (Hari)</label>
                <input id="jumlah" name="jumlah" type="number" value={formData.jumlah} onChange={handleChange} placeholder="Jumlah hari cuti" required className="mt-1 p-2 border rounded w-full text-black" />
            </div>
            <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-md h-10">Simpan</button>
          </form>
        </div>

        {/* Tabel Data Cuti */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Nama Karyawan</th>
                <th className="p-4 text-left">Tanggal Cuti</th>
                <th className="p-4 text-left">Jumlah (Hari)</th>
                <th className="p-4 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-black">
              {cutiList.map((c) => (
                <tr key={c.id}>
                  <td className="p-4">{c.karyawan.nama}</td>
                  <td className="p-4">{new Date(c.tanggal_cuti).toLocaleDateString('id-ID')}</td>
                  <td className="p-4">{c.jumlah}</td>
                  <td className="p-4 space-x-4">
                    <button onClick={() => handleEditClick(c)} className="text-yellow-600">Edit</button>
                    <button onClick={() => handleDelete(c.id)} className="text-red-600">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal untuk Edit */}
      {isModalOpen && editingCuti && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4 text-black">Edit Data Cuti</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
               <div>
                <label htmlFor="edit_karyawan_id" className="block text-sm font-medium text-gray-700">Karyawan</label>
                <select id="edit_karyawan_id" name="karyawan_id" value={editingCuti.karyawan_id} onChange={(e) => setEditingCuti({...editingCuti, karyawan_id: Number(e.target.value)})} className="mt-1 p-2 border rounded w-full text-black" required>
                    {karyawanList.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
                </select>
            </div>
             <div>
                <label htmlFor="edit_tanggal_cuti" className="block text-sm font-medium text-gray-700">Tanggal Cuti</label>
                <input id="edit_tanggal_cuti" name="tanggal_cuti" type="date" value={editingCuti.tanggal_cuti} onChange={(e) => setEditingCuti({...editingCuti, tanggal_cuti: e.target.value})} required className="mt-1 p-2 border rounded w-full text-black" />
            </div>
            <div>
                <label htmlFor="edit_jumlah" className="block text-sm font-medium text-gray-700">Jumlah (Hari)</label>
                <input id="edit_jumlah" name="jumlah" type="number" value={editingCuti.jumlah} onChange={(e) => setEditingCuti({...editingCuti, jumlah: Number(e.target.value)})} placeholder="Jumlah hari cuti" required className="mt-1 p-2 border rounded w-full text-black" />
            </div>
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