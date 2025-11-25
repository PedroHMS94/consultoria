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

    const trainingPhases = await prisma.trainingPhase.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(trainingPhases);
  } catch (error) {
    console.error('Error fetching training phases:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar fases de treino' },
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

    const trainingPhase = await prisma.trainingPhase.create({
      data: {
        name: body.name,
        color: body.color || '#10B981',
        order: body.order || 0,
      },
    });

    return NextResponse.json(trainingPhase, { status: 201 });
  } catch (error) {
    console.error('Error creating training phase:', error);
    return NextResponse.json(
      { error: 'Erro ao criar fase de treino' },
      { status: 500 }
    );
  }
}
