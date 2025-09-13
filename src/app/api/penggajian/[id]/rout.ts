// src/app/api/penggajian/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PUT (update) a penggajian record
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const numericData = {
      karyawan_id: Number(data.karyawan_id),
      jumlah_gaji: Number(data.jumlah_gaji),
      jumlah_lembur: Number(data.jumlah_lembur),
      potongan: Number(data.potongan),
      total_gaji_diterima: Number(data.total_gaji_diterima),
      tanggal: new Date(data.tanggal),
      keterangan: data.keterangan,
    };
    const updatedPenggajian = await prisma.penggajian.update({
      where: { id: Number(params.id) },
      data: numericData,
    });
    return NextResponse.json(updatedPenggajian);
  } catch (error) {
    return NextResponse.json({ message: 'Gagal memperbarui data penggajian', error }, { status: 500 });
  }
}

// DELETE a penggajian record
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.penggajian.delete({
      where: { id: Number(params.id) },
    });
    return NextResponse.json({ message: 'Data penggajian berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal menghapus data penggajian', error }, { status: 500 });
  }
}