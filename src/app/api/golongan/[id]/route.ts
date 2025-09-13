// src/app/api/karyawan/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const data = await request.json();
  const updatedKaryawan = await prisma.karyawan.update({
    where: { id: Number(params.id) },
    data,
  });
  return NextResponse.json(updatedKaryawan);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await prisma.karyawan.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ message: 'Data berhasil dihapus' });
}