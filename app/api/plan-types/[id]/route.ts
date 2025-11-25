import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();

    const planType = await prisma.planType.update({
      where: { id: params.id },
      data: {
        name: body.name,
        color: body.color,
        order: body.order,
      },
    });

    return NextResponse.json(planType);
  } catch (error) {
    console.error('Error updating plan type:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar tipo de plano' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await prisma.planType.update({
      where: { id: params.id },
      data: { active: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting plan type:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar tipo de plano' },
      { status: 500 }
    );
  }
}
