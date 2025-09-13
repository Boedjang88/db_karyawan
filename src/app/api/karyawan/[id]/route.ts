import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const karyawan = await prisma.karyawan.findUnique({ where: { id: Number(params.id) } });
    if (!karyawan) return NextResponse.json({ message: 'Not Found' }, { status: 404 });
    return NextResponse.json(karyawan);
  } catch (error) {
    return NextResponse.json({ message: 'GET by ID Error', error }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updatedKaryawan = await prisma.karyawan.update({
      where: { id: Number(params.id) },
      data: body,
    });
    return NextResponse.json(updatedKaryawan);
  } catch (error) {
    return NextResponse.json({ message: 'PUT Error', error }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.karyawan.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ message: 'Delete successful' });
  } catch (error) {
    return NextResponse.json({ message: 'DELETE Error', error }, { status: 500 });
  }
}