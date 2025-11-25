import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const planTypes = await prisma.planType.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(planTypes);
  } catch (error) {
    console.error('Error fetching plan types:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar tipos de plano' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();

    const planType = await prisma.planType.create({
      data: {
        name: body.name,
        color: body.color || '#3B82F6',
        order: body.order || 0,
      },
    });

    return NextResponse.json(planType, { status: 201 });
  } catch (error) {
    console.error('Error creating plan type:', error);
    return NextResponse.json(
      { error: 'Erro ao criar tipo de plano' },
      { status: 500 }
    );
  }
}
