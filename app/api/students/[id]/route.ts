import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const student = await prisma.student.findUnique({
      where: { id: params.id },
      include: {
        planType: true,
        trainingPhase: true,
        paymentHistory: {
          orderBy: {
            paymentDate: 'desc',
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Aluno não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar aluno' },
      { status: 500 }
    );
  }
}

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

    const student = await prisma.student.update({
      where: { id: params.id },
      data: {
        name: body.name,
        email: body.email || null,
        planTypeId: body.planTypeId,
        planStartDate: new Date(body.planStartDate),
        planExpiryDate: new Date(body.planExpiryDate),
        trainingStartDate: body.trainingStartDate ? new Date(body.trainingStartDate) : null,
        trainingExpiryDate: body.trainingExpiryDate ? new Date(body.trainingExpiryDate) : null,
        trainingPhaseId: body.trainingPhaseId || null,
        trainingStatus: body.trainingStatus,
        paymentStatus: body.paymentStatus,
        paymentMethod: body.paymentMethod || null,
        paymentDate: body.paymentDate ? new Date(body.paymentDate) : null,
        discount: body.discount || 0,
        discountType: body.discountType || 'valor',
        trainingAccessId: body.trainingAccessId || null,
        observations: body.observations || null,
      },
      include: {
        planType: true,
        trainingPhase: true,
      },
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar aluno' },
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

    await prisma.student.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar aluno' },
      { status: 500 }
    );
  }
}
