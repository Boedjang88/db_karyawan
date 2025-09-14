'use client';

import { useState, useEffect, FormEvent, useCallback, ChangeEvent, FC, InputHTMLAttributes, SelectHTMLAttributes } from 'react';

// Tipe Data
interface Karyawan {
  id: number;
  nama: string;
}
interface Lembur {
  id: number;
  tanggal_lembur: string;
  jumlah: number;
  karyawan_id: number;
  karyawan: Karyawan;
}

// Tipe Props untuk Komponen Helper
interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}
interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  options: { value: string | number; label: string }[];
}

// Komponen Helper
const InputField: FC<InputFieldProps> = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <input id={id} {...props} className="mt-1 p-2 border rounded w-full text-black" />
  </div>
);

const SelectField: FC<SelectFieldProps> = ({ label, id, options, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <select id={id} {...props} className="mt-1 p-2 border rounded w-full text-black">
      {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
  </div>
);

export default function LemburPage() {
  const [lemburList, setLemburList] = useState<Lembur[]>([]);
  const [karyawanList, setKaryawanList] = useState<Karyawan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const initialFormData = {
    karyawan_id: '',
    tanggal_lembur: new Date().toISOString().split('T')[0],
    jumlah: '',
  };
  const [formData, setFormData] = useState(initialFormData);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<Omit<Lembur, 'karyawan'> | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [lemburRes, karyawanRes] = await Promise.all([
        fetch('/api/lembur'),
        fetch('/api/karyawan'),
      ]);
      const lemburData = await lemburRes.json();
      const karyawanData = await karyawanRes.json();
      
      setLemburList(lemburData);
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

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleEditChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingData) return;
    setEditingData(prev => ({ ...prev!, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await fetch('/api/lembur', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setFormData({ ...initialFormData, karyawan_id: karyawanList[0]?.id.toString() || '' });
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menghapus data lembur ini?')) {
      await fetch(`/api/lembur/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  const handleEditClick = (data: Lembur) => {
    setEditingData({
        ...data,
        tanggal_lembur: new Date(data.tanggal_lembur).toISOString().split('T')[0],
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
    
    await fetch(`/api/lembur/${editingData.id}`, {
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
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6">Manajemen Lembur</h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-black">Tambah Data Lembur</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <SelectField label="Karyawan" id="karyawan_id" name="karyawan_id" value={formData.karyawan_id} onChange={handleChange} options={karyawanList.map(k => ({ value: k.id, label: k.nama }))} required />
            <InputField label="Tanggal Lembur" id="tanggal_lembur" name="tanggal_lembur" type="date" value={formData.tanggal_lembur} onChange={handleChange} required />
            <InputField label="Jumlah (Jam)" id="jumlah" name="jumlah" type="number" min="1" value={formData.jumlah} onChange={handleChange} placeholder="Jumlah jam lembur" required />
            <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-md h-10 self-end">Simpan</button>
          </form>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Nama Karyawan</th>
                <th className="p-4 text-left">Tanggal Lembur</th>
                <th className="p-4 text-left">Jumlah (Jam)</th>
                <th className="p-4 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-black">
              {lemburList.map((l) => (
                <tr key={l.id}>
                  <td className="p-4">{l.karyawan.nama}</td>
                  <td className="p-4">{new Date(l.tanggal_lembur).toLocaleDateString('id-ID')}</td>
                  <td className="p-4">{l.jumlah}</td>
                  <td className="p-4 space-x-4">
                    <button onClick={() => handleEditClick(l)} className="text-yellow-600">Edit</button>
                    <button onClick={() => handleDelete(l.id)} className="text-red-600">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && editingData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4 text-black">Edit Data Lembur</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
               <SelectField label="Karyawan" id="edit_karyawan_id" name="karyawan_id" value={editingData.karyawan_id} onChange={handleEditChange} options={karyawanList.map(k => ({ value: k.id, label: k.nama }))} required />
               <InputField label="Tanggal Lembur" id="edit_tanggal_lembur" name="tanggal_lembur" type="date" value={editingData.tanggal_lembur} onChange={handleEditChange} required />
               <InputField label="Jumlah (Jam)" id="edit_jumlah" name="jumlah" type="number" min="1" value={editingData.jumlah} onChange={handleEditChange} placeholder="Jumlah jam lembur" required />
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