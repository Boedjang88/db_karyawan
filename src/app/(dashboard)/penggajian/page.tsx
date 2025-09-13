// src/app/(dashboard)/penggajian/page.tsx
'use client';

import { useState, useEffect, FormEvent, useCallback } from 'react';

// Definisikan tipe data/interface
interface Karyawan {
  id: number;
  nama: string;
}
interface Penggajian {
  id: number;
  tanggal: string;
  keterangan: string;
  jumlah_gaji: number;
  jumlah_lembur: number;
  potongan: number;
  total_gaji_diterima: number;
  karyawan_id: number;
  karyawan: Karyawan;
}

export default function PenggajianPage() {
  const [penggajianList, setPenggajianList] = useState<Penggajian[]>([]);
  const [karyawanList, setKaryawanList] = useState<Karyawan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    karyawan_id: '',
    tanggal: new Date().toISOString().split('T')[0],
    keterangan: '',
    jumlah_gaji: '',
    jumlah_lembur: '',
    potongan: '',
    total_gaji_diterima: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<Omit<Penggajian, 'karyawan'> | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [penggajianRes, karyawanRes] = await Promise.all([
        fetch('/api/penggajian'),
        fetch('/api/karyawan'),
      ]);
      const penggajianData = await penggajianRes.json();
      const karyawanData = await karyawanRes.json();
      
      setPenggajianList(penggajianData);
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

  // Fungsi ini sekarang akan digunakan di form tambah
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await fetch('/api/penggajian', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setFormData({ karyawan_id: karyawanList[0]?.id.toString() || '', tanggal: new Date().toISOString().split('T')[0], keterangan: '', jumlah_gaji: '', jumlah_lembur: '', potongan: '', total_gaji_diterima: '' });
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menghapus data penggajian ini?')) {
      await fetch(`/api/penggajian/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  const handleEditClick = (data: Penggajian) => {
    setEditingData({
      ...data,
      tanggal: new Date(data.tanggal).toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };
  
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingData(null);
  };

  const handleUpdateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingData) return;
    
    await fetch(`/api/penggajian/${editingData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingData),
    });
    handleModalClose();
    fetchData();
  };

  if (isLoading) return <p className="text-center mt-4">Memuat data...</p>;

  return (
    <>
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Manajemen Penggajian</h1>

        {/* Form Tambah */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-black">Tambah Data Penggajian</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label htmlFor="karyawan_id">Karyawan</label>
              <select id="karyawan_id" name="karyawan_id" value={formData.karyawan_id} onChange={handleChange} required className="mt-1 p-2 border rounded w-full text-black">
                {karyawanList.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="tanggal">Tanggal</label>
              <input id="tanggal" name="tanggal" type="date" value={formData.tanggal} onChange={handleChange} required className="mt-1 p-2 border rounded w-full text-black" />
            </div>
            <div>
              <label htmlFor="jumlah_gaji">Jumlah Gaji</label>
              <input id="jumlah_gaji" name="jumlah_gaji" type="number" value={formData.jumlah_gaji} onChange={handleChange} placeholder="Gaji Pokok" required className="mt-1 p-2 border rounded w-full text-black" />
            </div>
            <div>
              <label htmlFor="jumlah_lembur">Jumlah Lembur</label>
              <input id="jumlah_lembur" name="jumlah_lembur" type="number" value={formData.jumlah_lembur} onChange={handleChange} placeholder="Tunj. Lembur" required className="mt-1 p-2 border rounded w-full text-black" />
            </div>
            <div>
              <label htmlFor="potongan">Potongan</label>
              <input id="potongan" name="potongan" type="number" value={formData.potongan} onChange={handleChange} placeholder="Potongan" required className="mt-1 p-2 border rounded w-full text-black" />
            </div>
             <div>
              <label htmlFor="total_gaji_diterima">Total Diterima</label>
              <input id="total_gaji_diterima" name="total_gaji_diterima" type="number" value={formData.total_gaji_diterima} onChange={handleChange} placeholder="Total Gaji" required className="mt-1 p-2 border rounded w-full text-black" />
            </div>
             <div className="col-span-full">
              <label htmlFor="keterangan">Keterangan</label>
              <textarea id="keterangan" name="keterangan" value={formData.keterangan} onChange={handleChange} placeholder="Keterangan..." className="mt-1 p-2 border rounded w-full text-black" />
            </div>
            <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-md h-10">Simpan</button>
          </form>
        </div>

        {/* Tabel Data */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Nama Karyawan</th>
                <th className="p-4 text-left">Tanggal</th>
                <th className="p-4 text-left">Total Diterima</th>
                <th className="p-4 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-black">
              {penggajianList.map((p) => (
                <tr key={p.id}>
                  <td className="p-4">{p.karyawan.nama}</td>
                  <td className="p-4">{new Date(p.tanggal).toLocaleDateString('id-ID')}</td>
                  <td className="p-4">Rp {p.total_gaji_diterima.toLocaleString('id-ID')}</td>
                  <td className="p-4 space-x-4">
                    <button onClick={() => handleEditClick(p)} className="text-yellow-600">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Edit */}
      {isModalOpen && editingData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4 text-black">Edit Data Penggajian</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              {/* Salin/tempel field input dari form tambah ke sini, lalu gunakan 'editingData' dan 'setEditingData' */}
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