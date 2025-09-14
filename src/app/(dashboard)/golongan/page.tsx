'use client';

import { useState, useEffect, FormEvent, useCallback, FC, InputHTMLAttributes, ChangeEvent } from 'react';

// Tipe Data untuk Golongan
interface Golongan {
  id: number;
  nama_golongan: string;
  gaji_pokok: number;
  tunjangan_istri: number;
  tunjangan_anak: number;
  tunjangan_transport: number;
  tunjangan_makan: number;
}
type GolonganFormData = Omit<Golongan, 'id'>;

// Tipe Props untuk Komponen Input Helper
interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

// Komponen Input Helper untuk form yang lebih bersih
const InputField: FC<InputFieldProps> = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <input id={id} {...props} className="mt-1 p-2 border rounded w-full text-black" />
  </div>
);

export default function GolonganPage() {
  const [golonganList, setGolonganList] = useState<Golongan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk form tambah data
  const initialFormData: GolonganFormData = {
    nama_golongan: '',
    gaji_pokok: 0,
    tunjangan_istri: 0,
    tunjangan_anak: 0,
    tunjangan_transport: 0,
    tunjangan_makan: 0,
  };
  const [formData, setFormData] = useState<GolonganFormData>(initialFormData);

  // State untuk modal edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGolongan, setEditingGolongan] = useState<Golongan | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/golongan');
      if (!response.ok) {
        throw new Error('Gagal mengambil data dari server');
      }
      const data = await response.json();
      setGolonganList(data);
    } catch (error) {
      console.error("Gagal mengambil data golongan:", error);
      alert('Gagal mengambil data golongan.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!editingGolongan) return;
    const { name, value } = e.target;
    setEditingGolongan(prev => ({ ...prev!, [name]: value }));
  };

  const convertFormDataToNumber = (data: any) => ({
    ...data,
    gaji_pokok: Number(data.gaji_pokok),
    tunjangan_istri: Number(data.tunjangan_istri),
    tunjangan_anak: Number(data.tunjangan_anak),
    tunjangan_transport: Number(data.tunjangan_transport),
    tunjangan_makan: Number(data.tunjangan_makan),
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await fetch('/api/golongan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(convertFormDataToNumber(formData)),
    });
    setFormData(initialFormData);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus golongan ini?')) {
      const response = await fetch(`/api/golongan/${id}`, { method: 'DELETE' });

      if (response.ok) {
        alert('Golongan berhasil dihapus.');
        fetchData();
      } else {
        const data = await response.json();
        alert(data.message || 'Gagal menghapus data.');
      }
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
      body: JSON.stringify(convertFormDataToNumber(editingGolongan)),
    });
    handleModalClose();
    fetchData();
  };

  if (isLoading) return <p className="text-center mt-4">Memuat data...</p>;

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6">Manajemen Golongan</h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-black">Tambah Golongan Baru</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField label="Nama Golongan" id="nama_golongan" name="nama_golongan" value={formData.nama_golongan} onChange={handleChange} required />
              <InputField label="Gaji Pokok" id="gaji_pokok" name="gaji_pokok" type="number" min="0" value={formData.gaji_pokok} onChange={handleChange} required />
              <InputField label="Tunjangan Istri" id="tunjangan_istri" name="tunjangan_istri" type="number" min="0" value={formData.tunjangan_istri} onChange={handleChange} required />
              <InputField label="Tunjangan Anak" id="tunjangan_anak" name="tunjangan_anak" type="number" min="0" value={formData.tunjangan_anak} onChange={handleChange} required />
              <InputField label="Tunjangan Transport" id="tunjangan_transport" name="tunjangan_transport" type="number" min="0" value={formData.tunjangan_transport} onChange={handleChange} required />
              <InputField label="Tunjangan Makan" id="tunjangan_makan" name="tunjangan_makan" type="number" min="0" value={formData.tunjangan_makan} onChange={handleChange} required />
            </div>
            <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-md">Simpan</button>
          </form>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
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
                  <td className="p-4">Rp {g.gaji_pokok.toLocaleString('id-ID')}</td>
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

      {isModalOpen && editingGolongan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4 text-black">Edit Golongan</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Nama Golongan" id="edit_nama_golongan" name="nama_golongan" value={editingGolongan.nama_golongan} onChange={handleEditChange} required />
                <InputField label="Gaji Pokok" id="edit_gaji_pokok" name="gaji_pokok" type="number" min="0" value={editingGolongan.gaji_pokok} onChange={handleEditChange} required />
                <InputField label="Tunjangan Istri" id="edit_tunjangan_istri" name="tunjangan_istri" type="number" min="0" value={editingGolongan.tunjangan_istri} onChange={handleEditChange} required />
                <InputField label="Tunjangan Anak" id="edit_tunjangan_anak" name="tunjangan_anak" type="number" min="0" value={editingGolongan.tunjangan_anak} onChange={handleEditChange} required />
                <InputField label="Tunjangan Transport" id="edit_tunjangan_transport" name="tunjangan_transport" type="number" min="0" value={editingGolongan.tunjangan_transport} onChange={handleEditChange} required />
                <InputField label="Tunjangan Makan" id="edit_tunjangan_makan" name="tunjangan_makan" type="number" min="0" value={editingGolongan.tunjangan_makan} onChange={handleEditChange} required />
              </div>
              <div className="flex justify-end space-x-4 pt-4">
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