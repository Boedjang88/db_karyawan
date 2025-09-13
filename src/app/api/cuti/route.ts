// src/app/api/cuti/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all cuti records
export async function GET() {
  try {
    const cuti = await prisma.cuti.findMany({
      include: {
        karyawan: true, // Sertakan data karyawan
      },
      orderBy: {
        tanggal_cuti: 'desc', // Urutkan dari yang terbaru
      },
    });
    return NextResponse.json(cuti);
  } catch (error) {
    return NextResponse.json({ message: 'Gagal mengambil data cuti', error }, { status: 500 });
  }
}

// POST a new cuti record
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newCuti = await prisma.cuti.create({
      data: {
        karyawan_id: Number(data.karyawan_id),
        tanggal_cuti: new Date(data.tanggal_cuti),
        jumlah: Number(data.jumlah),
      },
    });
    return NextResponse.json(newCuti, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal membuat data cuti', error }, { status: 500 });
  }
}