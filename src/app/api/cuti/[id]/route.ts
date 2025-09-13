// src/app/api/cuti/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PUT (update) a cuti record
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const updatedCuti = await prisma.cuti.update({
      where: { id: Number(params.id) },
      data: {
        karyawan_id: Number(data.karyawan_id),
        tanggal_cuti: new Date(data.tanggal_cuti),
        jumlah: Number(data.jumlah),
      },
    });
    return NextResponse.json(updatedCuti);
  } catch (error) {
    return NextResponse.json({ message: 'Gagal memperbarui data cuti', error }, { status: 500 });
  }
}

// DELETE a cuti record
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.cuti.delete({
      where: { id: Number(params.id) },
    });
    return NextResponse.json({ message: 'Data cuti berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal menghapus data cuti', error }, { status: 500 });
  }
}