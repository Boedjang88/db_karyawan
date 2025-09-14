// src/app/api/golongan/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// (Fungsi PUT tetap sama, tidak perlu diubah)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const data = await request.json();
  const updated = await prisma.golongan.update({
    where: { id: Number(params.id) },
    data,
  });
  return NextResponse.json(updated);
}

// PERBAIKAN TOTAL PADA FUNGSI DELETE
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);

  try {
    // Langkah 1: Cek apakah ada karyawan yang masih menggunakan golongan ini
    const karyawanTerkait = await prisma.karyawan.findFirst({
      where: {
        golongan_id: id,
      },
    });

    // Langkah 2: Jika ada, kirim pesan error yang jelas dan jangan hapus
    if (karyawanTerkait) {
      return NextResponse.json(
        { message: 'Gagal menghapus: Golongan ini masih digunakan oleh satu atau lebih karyawan.' },
        { status: 400 } // 400 Bad Request adalah status yang tepat untuk ini
      );
    }

    // Langkah 3: Jika tidak ada karyawan terkait, baru lakukan penghapusan
    await prisma.golongan.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Golongan berhasil dihapus' });

  } catch (error) {
    console.error("Error saat menghapus golongan:", error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server saat mencoba menghapus golongan.' },
      { status: 500 }
    );
  }
}