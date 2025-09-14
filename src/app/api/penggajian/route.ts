// src/app/api/penggajian/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all penggajian records
export async function GET() {
  try {
    const penggajian = await prisma.penggajian.findMany({
      include: { karyawan: true },
      orderBy: { id: 'desc' },
    });
    return NextResponse.json(penggajian);
  } catch (error) {
    console.error("[API_ERROR] GET:", error);
    return NextResponse.json({ message: 'Server error', error: (error as Error).message }, { status: 500 });
  }
}

// POST a new penggajian record (AUTO-CALCULATION)
export async function POST(request: Request) {
  try {
    const { karyawan_id, bulan, tahun, keterangan } = await request.json();
    const id = Number(karyawan_id);
    const bln = Number(bulan);
    const thn = Number(tahun);

    const karyawan = await prisma.karyawan.findUnique({
      where: { id },
      include: { golongan: true },
    });

    if (!karyawan) return NextResponse.json({ message: 'Karyawan tidak ditemukan' }, { status: 404 });

    const startDate = new Date(thn, bln - 1, 1);
    const endDate = new Date(thn, bln, 0);

    const lemburRecords = await prisma.lembur.findMany({
      where: { karyawan_id: id, tanggal_lembur: { gte: startDate, lte: endDate } },
    });

    const cutiRecords = await prisma.cuti.findMany({
      where: { karyawan_id: id, tanggal_cuti: { gte: startDate, lte: endDate } },
    });

    const UPAH_LEMBUR_PER_JAM = 25000;
    const POTONGAN_CUTI_PER_HARI = 100000;

    const gaji_pokok_saat_itu = karyawan.golongan.gaji_pokok;
    const total_tunjangan = karyawan.golongan.tunjangan_anak + karyawan.golongan.tunjangan_istri + karyawan.golongan.tunjangan_makan + karyawan.golongan.tunjangan_transport;
    
    const total_upah_lembur = lemburRecords.reduce((sum: number, r: { jumlah: number }) => sum + r.jumlah, 0) * UPAH_LEMBUR_PER_JAM;
    const total_potongan_cuti = cutiRecords.reduce((sum: number, r: { jumlah: number }) => sum + r.jumlah, 0) * POTONGAN_CUTI_PER_HARI;

    const gaji_diterima = gaji_pokok_saat_itu + total_tunjangan + total_upah_lembur - total_potongan_cuti;

    const newPenggajian = await prisma.penggajian.create({
      data: {
        karyawan_id: id,
        bulan: bln,
        tahun: thn,
        tanggal_gajian: new Date(),
        gaji_pokok_saat_itu,
        total_tunjangan,
        total_upah_lembur,
        total_potongan_cuti,
        gaji_diterima,
        keterangan,
      },
    });

    return NextResponse.json(newPenggajian, { status: 201 });
  } catch (error) {
    console.error("[API_ERROR] POST:", error);
    return NextResponse.json({ message: 'Gagal memproses penggajian', error: (error as Error).message }, { status: 500 });
  }
}