import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const karyawan = await prisma.karyawan.findMany({ include: { golongan: true } });
    return NextResponse.json(karyawan);
  } catch (error) {
    return NextResponse.json({ message: 'GET Error', error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newKaryawan = await prisma.karyawan.create({ data: body });
    return NextResponse.json(newKaryawan, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'POST Error', error }, { status: 500 });
  }
}