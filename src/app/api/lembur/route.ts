// src/app/api/lembur/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all lembur records
export async function GET() {
  try {
    const lembur = await prisma.lembur.findMany({
      include: {
        karyawan: true, // Sertakan data karyawan untuk ditampilkan
      },
      orderBy: {
        tanggal_lembur: 'desc', // Urutkan dari yang terbaru
      },
    });
    return NextResponse.json(lembur);
  } catch (error) {
    return NextResponse.json({ message: 'Gagal mengambil data lembur', error }, { status: 500 });
  }
}

// POST a new lembur record
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newLembur = await prisma.lembur.create({
      data: {
        karyawan_id: Number(data.karyawan_id),
        tanggal_lembur: new Date(data.tanggal_lembur),
        jumlah: Number(data.jumlah),
      },
    });
    return NextResponse.json(newLembur, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal membuat data lembur', error }, { status: 500 });
  }
}