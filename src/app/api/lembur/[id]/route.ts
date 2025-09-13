// src/app/api/lembur/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PUT (update) a lembur record
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const updatedLembur = await prisma.lembur.update({
      where: { id: Number(params.id) },
      data: {
        karyawan_id: Number(data.karyawan_id),
        tanggal_lembur: new Date(data.tanggal_lembur),
        jumlah: Number(data.jumlah),
      },
    });
    return NextResponse.json(updatedLembur);
  } catch (error) {
    return NextResponse.json({ message: 'Gagal memperbarui data lembur', error }, { status: 500 });
  }
}

// DELETE a lembur record
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.lembur.delete({
      where: { id: Number(params.id) },
    });
    return NextResponse.json({ message: 'Data lembur berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal menghapus data lembur', error }, { status: 500 });
  }
}