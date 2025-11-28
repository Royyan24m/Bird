import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
      },
    });
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
