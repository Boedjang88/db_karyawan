// src/app/api/penggajian/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all penggajian records
export async function GET() {
  try {
    const penggajian = await prisma.penggajian.findMany({
      include: {
        karyawan: true, // Sertakan data karyawan
      },
      orderBy: {
        tanggal: 'desc',
      },
    });
    return NextResponse.json(penggajian);
  } catch (error) {
    return NextResponse.json({ message: 'Gagal mengambil data penggajian', error }, { status: 500 });
  }
}

// POST a new penggajian record
export async function POST(request: Request) {
  try {
    const data = await request.json();
    // Konversi semua nilai numerik dari string ke number
    const numericData = {
      karyawan_id: Number(data.karyawan_id),
      jumlah_gaji: Number(data.jumlah_gaji),
      jumlah_lembur: Number(data.jumlah_lembur),
      potongan: Number(data.potongan),
      total_gaji_diterima: Number(data.total_gaji_diterima),
      tanggal: new Date(data.tanggal),
      keterangan: data.keterangan,
    };
    const newPenggajian = await prisma.penggajian.create({
      data: numericData,
    });
    return NextResponse.json(newPenggajian, { status: 201 });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    return NextResponse.json({ message: 'Gagal membuat data penggajian', error }, { status: 500 });
  }
}