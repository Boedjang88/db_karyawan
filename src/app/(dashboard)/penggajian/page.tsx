// src/app/(dashboard)/penggajian/page.tsx
'use client';
import { useState, useEffect, FormEvent, ChangeEvent, FC, SelectHTMLAttributes, useCallback } from 'react';

// ... (Interface Karyawan & Penggajian tetap sama)
interface Karyawan { id: number; nama: string; }
interface Penggajian {
  id: number;
  tanggal_gajian: string;
  bulan: number;
  tahun: number;
  keterangan: string | null;
  gaji_diterima: number;
  karyawan: Karyawan;
}

const SelectField: FC<SelectHTMLAttributes<HTMLSelectElement> & { label: string; options: { value: string | number; label: string }[] }> = ({ label, id, options, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <select id={id} {...props} className="mt-1 p-2 border rounded w-full text-black" aria-label={label}>
            {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
    </div>
);

export default function PenggajianPage() {
    const [penggajianList, setPenggajianList] = useState<Penggajian[]>([]);
    const [karyawanList, setKaryawanList] = useState<Karyawan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({ karyawan_id: '', bulan: new Date().getMonth() + 1, tahun: new Date().getFullYear(), keterangan: '' });

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [penggajianRes, karyawanRes] = await Promise.all([
                fetch('/api/penggajian'),
                fetch('/api/karyawan')
            ]);

            // --- PERBAIKAN ERROR HANDLING DI SINI ---
            if (!penggajianRes.ok) {
                const errorText = await penggajianRes.text();
                console.error("Error fetching penggajian:", errorText);
                throw new Error('Gagal memuat data penggajian.');
            }
             if (!karyawanRes.ok) {
                const errorText = await karyawanRes.text();
                console.error("Error fetching karyawan:", errorText);
                throw new Error('Gagal memuat data karyawan.');
            }

            const penggajianData = await penggajianRes.json();
            const karyawanData = await karyawanRes.json();
            // --- AKHIR PERBAIKAN ---

            setPenggajianList(Array.isArray(penggajianData) ? penggajianData : []);
            setKaryawanList(karyawanData);
            if (karyawanData.length > 0 && !formData.karyawan_id) {
                setFormData(prev => ({ ...prev, karyawan_id: String(karyawanData[0].id) }));
            }
        } catch (error) {
            console.error(error);
            // Anda bisa menambahkan notifikasi error untuk pengguna di sini
        }
        finally {
            setIsLoading(false);
        }
    }, [formData.karyawan_id]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleProcessGaji = async (e: FormEvent) => {
        e.preventDefault();
        await fetch('/api/penggajian', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
        fetchData();
    };

    const handleDelete = async (id: number) => {
        if (confirm('Yakin ingin menghapus riwayat gaji ini?')) {
            await fetch(`/api/penggajian/${id}`, { method: 'DELETE' });
            fetchData();
        }
    };

    if (isLoading) return <p className="text-center mt-4">Memuat data...</p>;

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6">Proses Penggajian</h1>

            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-black">Proses Gaji Karyawan Baru</h2>
                <form onSubmit={handleProcessGaji} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <SelectField label="Pilih Karyawan" id="karyawan_id" name="karyawan_id" value={formData.karyawan_id} onChange={handleChange} options={karyawanList.map(k => ({ value: k.id, label: k.nama }))} required />
                    <SelectField label="Bulan" id="bulan" name="bulan" value={formData.bulan} onChange={handleChange} options={Array.from({length:12}, (_,i)=>({value:i+1,label:new Date(0,i).toLocaleString('id-ID',{month:'long'})}))} />
                    <SelectField label="Tahun" id="tahun" name="tahun" value={formData.tahun} onChange={handleChange} options={Array.from({length:5},(_,i)=>({value:new Date().getFullYear()-i,label:(new Date().getFullYear()-i).toString()}))} />
                    <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-md h-10 self-end">Hitung & Simpan Gaji</button>
                </form>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <h2 className="text-xl font-semibold mb-4 text-black p-6">Riwayat Penggajian</h2>
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 text-left">Nama Karyawan</th>
                            <th className="p-4 text-left">Periode</th>
                            <th className="p-4 text-left">Gaji Diterima</th>
                            <th className="p-4 text-left">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-black">
                        {penggajianList.map(p => (
                            <tr key={p.id}>
                                <td className="p-4">{p.karyawan.nama}</td>
                                <td className="p-4">{new Date(p.tahun,p.bulan-1).toLocaleString('id-ID',{month:'long',year:'numeric'})}</td>
                                <td className="p-4">Rp {p.gaji_diterima.toLocaleString('id-ID')}</td>
                                <td className="p-4"><button onClick={()=>handleDelete(p.id)} className="text-red-600">Hapus</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}