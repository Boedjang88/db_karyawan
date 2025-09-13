// src/components/dashboard/types.ts

export type Golongan = {
  id: number;
  nama_golongan: string;
  gaji_pokok: number;
  tunjangan_istri: number;
  tunjangan_anak: number;
  tunjangan_transport: number;
  tunjangan_makan: number;
};

export type Karyawan = {
  id: number;
  nip: string;
  nik: string;
  nama: string;
  jenis_kelamin: 'pria' | 'wanita';
  tempat_lahir: string;
  tanggal_lahir: string | Date;
  telpon: string;
  agama: string;
  status_nikah: 'belum_nikah' | 'nikah';
  alamat: string;
  foto: string;
  golongan_id: number;
  golongan?: Golongan;
};