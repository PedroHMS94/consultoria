import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const planTypeId = searchParams.get('planTypeId');
    const paymentStatus = searchParams.get('paymentStatus');
    const trainingStatus = searchParams.get('trainingStatus');
    const trainingPhaseId = searchParams.get('trainingPhaseId');

    const where: any = {};

    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }
    if (planTypeId) {
      where.planTypeId = planTypeId;
    }
    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }
    if (trainingStatus) {
      where.trainingStatus = trainingStatus;
    }
    if (trainingPhaseId) {
      where.trainingPhaseId = trainingPhaseId;
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        planType: true,
        trainingPhase: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar alunos' },
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

    const student = await prisma.student.create({
      data: {
        name: body.name,
        email: body.email || null,
        planTypeId: body.planTypeId,
        planStartDate: new Date(body.planStartDate),
        planExpiryDate: new Date(body.planExpiryDate),
        trainingStartDate: body.trainingStartDate ? new Date(body.trainingStartDate) : null,
        trainingExpiryDate: body.trainingExpiryDate ? new Date(body.trainingExpiryDate) : null,
        trainingPhaseId: body.trainingPhaseId || null,
        trainingStatus: body.trainingStatus || 'Não Iniciado',
        paymentStatus: body.paymentStatus || 'Pendente',
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

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      { error: 'Erro ao criar aluno' },
      { status: 500 }
    );
  }
}
