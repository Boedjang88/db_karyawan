// src/app/api/karyawan/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const karyawan = await prisma.karyawan.findMany({ include: { golongan: true } });
  return NextResponse.json(karyawan);
}

export async function POST(request: Request) {
  const data = await request.json();
  const newKaryawan = await prisma.karyawan.create({ data });
  return NextResponse.json(newKaryawan, { status: 201 });
}