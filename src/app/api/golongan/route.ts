// src/app/api/golongan/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all
export async function GET() {
  const golongan = await prisma.golongan.findMany();
  return NextResponse.json(golongan);
}

// POST
export async function POST(request: Request) {
  const data = await request.json();
  const newGolongan = await prisma.golongan.create({ data });
  return NextResponse.json(newGolongan, { status: 201 });
}