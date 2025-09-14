'use client';

import React, { useState, useEffect, FormEvent, useCallback, ChangeEvent, FC, InputHTMLAttributes, SelectHTMLAttributes } from 'react';

// Tipe Data Terpusat
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
type KaryawanFormData = Omit<Karyawan, 'id' | 'golongan'>;

// List Agama untuk Dropdown
const AGAMA_LIST = ["Islam", "Kristen Protestan", "Kristen Katolik", "Hindu", "Buddha", "Konghucu"];

// Tipe untuk Props Komponen Helper
interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  options: { value: string | number; label: string }[];
}

// Komponen Helper dengan Tipe yang Benar
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

export default function KaryawanPage() {
  const [karyawanList, setKaryawanList] = useState<Karyawan[]>([]);
  const [golonganList, setGolonganList] = useState<Golongan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKaryawan, setEditingKaryawan] = useState<KaryawanFormData & { id: number } | null>(null);
  
  const initialFormData: KaryawanFormData = {
    nip: '', nik: '', nama: '', jenis_kelamin: 'pria', tempat_lahir: '', tanggal_lahir: '', telpon: '', agama: AGAMA_LIST[0], status_nikah: 'belum_nikah', alamat: '', foto: 'default.jpg', golongan_id: 0
  };
  const [formData, setFormData] = useState<KaryawanFormData>(initialFormData);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [karyawanRes, golonganRes] = await Promise.all([ fetch('/api/karyawan'), fetch('/api/golongan') ]);
      const karyawanData = await karyawanRes.json();
      const golonganData = await golonganRes.json();
      setKaryawanList(karyawanData);
      setGolonganList(golonganData);
      if (golonganData.length > 0 && formData.golongan_id === 0) {
        setFormData(prev => ({ ...prev, golongan_id: golonganData[0].id }));
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [formData.golongan_id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEditChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!editingKaryawan) return;
    const { name, value } = e.target;
    setEditingKaryawan(prev => ({ ...prev!, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await fetch('/api/karyawan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, golongan_id: Number(formData.golongan_id), tanggal_lahir: new Date(formData.tanggal_lahir) }),
    });
    setFormData({ ...initialFormData, golongan_id: golonganList[0]?.id || 0 });
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
      body: JSON.stringify({ ...editingKaryawan, golongan_id: Number(editingKaryawan.golongan_id), tanggal_lahir: new Date(editingKaryawan.tanggal_lahir) }),
    });
    handleModalClose();
    fetchData();
  };

  if (isLoading) return <p className="text-center mt-8">Memuat data...</p>;

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6">Manajemen Karyawan</h1>
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-black">Tambah Karyawan Baru</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField label="Nama Lengkap" id="nama" name="nama" value={formData.nama} onChange={handleChange} required />
              <InputField label="NIP (12 digit)" id="nip" name="nip" value={formData.nip} onChange={handleChange} required minLength={12} maxLength={12} />
              <InputField label="NIK (12 digit)" id="nik" name="nik" value={formData.nik} onChange={handleChange} required minLength={12} maxLength={12} />
              <InputField label="Tempat Lahir" id="tempat_lahir" name="tempat_lahir" value={formData.tempat_lahir} onChange={handleChange} required />
              <InputField label="Tanggal Lahir" id="tanggal_lahir" name="tanggal_lahir" type="date" value={formData.tanggal_lahir} onChange={handleChange} required />
              <InputField label="Telepon" id="telpon" name="telpon" value={formData.telpon} onChange={handleChange} required minLength={10} maxLength={12} />
              <SelectField label="Agama" id="agama" name="agama" value={formData.agama} onChange={handleChange} options={AGAMA_LIST.map(a => ({ value: a, label: a }))} />
              <SelectField label="Jenis Kelamin" id="jenis_kelamin" name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleChange} options={[{value: 'pria', label: 'Pria'}, {value: 'wanita', label: 'Wanita'}]} />
              <SelectField label="Status Nikah" id="status_nikah" name="status_nikah" value={formData.status_nikah} onChange={handleChange} options={[{value: 'belum_nikah', label: 'Belum Nikah'}, {value: 'nikah', label: 'Nikah'}]} />
              <div className="col-span-full md:col-span-1">
                <SelectField label="Golongan" id="golongan_id" name="golongan_id" value={formData.golongan_id} onChange={handleChange} options={golonganList.map(g => ({ value: g.id, label: g.nama_golongan }))} />
              </div>
              <div className="col-span-full">
                <label htmlFor="alamat" className="block text-sm font-medium text-gray-700">Alamat</label>
                <textarea id="alamat" name="alamat" value={formData.alamat} onChange={handleChange} required className="mt-1 p-2 border rounded w-full text-black" rows={3}/>
              </div>
            </div>
            <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-md">Simpan Karyawan</button>
          </form>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Nama</th><th className="p-4 text-left">NIP</th><th className="p-4 text-left">Golongan</th><th className="p-4 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-black">
              {karyawanList.map((k) => (
                <tr key={k.id}>
                  <td className="p-4">{k.nama}</td><td className="p-4">{k.nip}</td><td className="p-4">{k.golongan?.nama_golongan || '-'}</td>
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

      {isModalOpen && editingKaryawan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl">
            <h2 className="text-2xl font-bold mb-6 text-black">Edit Karyawan</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Nama Lengkap" id="edit_nama" name="nama" value={editingKaryawan.nama} onChange={handleEditChange} required />
                <InputField label="NIP (12 digit)" id="edit_nip" name="nip" value={editingKaryawan.nip} onChange={handleEditChange} required minLength={12} maxLength={12} />
                <InputField label="NIK (12 digit)" id="edit_nik" name="nik" value={editingKaryawan.nik} onChange={handleEditChange} required minLength={12} maxLength={12} />
                <InputField label="Tempat Lahir" id="edit_tempat_lahir" name="tempat_lahir" value={editingKaryawan.tempat_lahir} onChange={handleEditChange} required />
                <InputField label="Tanggal Lahir" id="edit_tanggal_lahir" name="tanggal_lahir" type="date" value={editingKaryawan.tanggal_lahir} onChange={handleEditChange} required />
                <InputField label="Telepon" id="edit_telpon" name="telpon" value={editingKaryawan.telpon} onChange={handleEditChange} required minLength={10} maxLength={12} />
                <SelectField label="Agama" id="edit_agama" name="agama" value={editingKaryawan.agama} onChange={handleEditChange} options={AGAMA_LIST.map(a => ({ value: a, label: a }))} />
                <SelectField label="Jenis Kelamin" id="edit_jenis_kelamin" name="jenis_kelamin" value={editingKaryawan.jenis_kelamin} onChange={handleEditChange} options={[{value: 'pria', label: 'Pria'}, {value: 'wanita', label: 'Wanita'}]} />
                <SelectField label="Status Nikah" id="edit_status_nikah" name="status_nikah" value={editingKaryawan.status_nikah} onChange={handleEditChange} options={[{value: 'belum_nikah', label: 'Belum Nikah'}, {value: 'nikah', label: 'Nikah'}]} />
                <SelectField label="Golongan" id="edit_golongan_id" name="golongan_id" value={editingKaryawan.golongan_id} onChange={handleEditChange} options={golonganList.map(g => ({ value: g.id, label: g.nama_golongan }))} />
              </div>
              <div className="col-span-full">
                <label htmlFor="edit_alamat" className="block text-sm font-medium text-gray-700">Alamat</label>
                <textarea id="edit_alamat" name="alamat" value={editingKaryawan.alamat} onChange={handleEditChange} required className="mt-1 p-2 border rounded w-full text-black" rows={3}/>
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