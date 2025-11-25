import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { stringify } from 'csv/sync';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let where: any = {};

    if (type === 'active') {
      where.planExpiryDate = { gte: new Date() };
    } else if (type === 'expiring') {
      const now = new Date();
      const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      where.planExpiryDate = {
        gte: now,
        lte: in30Days,
      };
    } else if (type === 'paid') {
      where.paymentStatus = 'Pago';
    } else if (type === 'pending') {
      where.paymentStatus = 'Pendente';
    } else if (type === 'overdue') {
      where.paymentStatus = 'Vencido';
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        planType: true,
        trainingPhase: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    const csvData = students.map((student) => ({
      nome: student?.name,
      email: student?.email || '',
      plano: student?.planType?.name,
      data_inicio_plano: student?.planStartDate?.toISOString?.()?.split?.('T')?.[0],
      data_vencimento_plano: student?.planExpiryDate?.toISOString?.()?.split?.('T')?.[0],
      data_inicio_treino: student?.trainingStartDate?.toISOString?.()?.split?.('T')?.[0] || '',
      data_vencimento_treino: student?.trainingExpiryDate?.toISOString?.()?.split?.('T')?.[0] || '',
      fase_treino: student?.trainingPhase?.name || '',
      status_treino: student?.trainingStatus,
      status_pagamento: student?.paymentStatus,
      forma_pagamento: student?.paymentMethod || '',
      data_pagamento: student?.paymentDate?.toISOString?.()?.split?.('T')?.[0] || '',
      desconto: student?.discount,
      tipo_desconto: student?.discountType,
      id_acesso: student?.trainingAccessId || '',
      observacoes: student?.observations || '',
    }));

    const csv = stringify(csvData, {
      header: true,
      columns: [
        'nome',
        'email',
        'plano',
        'data_inicio_plano',
        'data_vencimento_plano',
        'data_inicio_treino',
        'data_vencimento_treino',
        'fase_treino',
        'status_treino',
        'status_pagamento',
        'forma_pagamento',
        'data_pagamento',
        'desconto',
        'tipo_desconto',
        'id_acesso',
        'observacoes',
      ],
    });

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="export.csv"',
      },
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json(
      { error: 'Erro ao exportar dados' },
      { status: 500 }
    );
  }
}
