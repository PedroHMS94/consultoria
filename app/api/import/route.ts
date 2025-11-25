import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { parse } from 'csv/sync';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    const text = await file.text();
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    let imported = 0;
    const errors = [];

    for (const record of records) {
      try {
        // Find plan type
        const planType = await prisma.planType.findFirst({
          where: { name: record?.plano },
        });

        if (!planType) {
          errors.push(`Plano "${record?.plano}" não encontrado para ${record?.nome}`);
          continue;
        }

        // Find training phase if provided
        let trainingPhase = null;
        if (record?.fase_treino) {
          trainingPhase = await prisma.trainingPhase.findFirst({
            where: { name: record?.fase_treino },
          });
        }

        await prisma.student.create({
          data: {
            name: record?.nome,
            email: record?.email || null,
            planTypeId: planType.id,
            planStartDate: new Date(record?.data_inicio_plano),
            planExpiryDate: new Date(record?.data_vencimento_plano),
            trainingStartDate: record?.data_inicio_treino ? new Date(record?.data_inicio_treino) : null,
            trainingExpiryDate: record?.data_vencimento_treino ? new Date(record?.data_vencimento_treino) : null,
            trainingPhaseId: trainingPhase?.id || null,
            trainingStatus: record?.status_treino || 'Não Iniciado',
            paymentStatus: record?.status_pagamento || 'Pendente',
            paymentMethod: record?.forma_pagamento || null,
            paymentDate: record?.data_pagamento ? new Date(record?.data_pagamento) : null,
            discount: parseFloat(record?.desconto || '0'),
            discountType: record?.tipo_desconto || 'valor',
            trainingAccessId: record?.id_acesso || null,
            observations: record?.observacoes || null,
          },
        });

        imported++;
      } catch (error: any) {
        console.error('Error importing record:', error);
        errors.push(`Erro ao importar ${record?.nome}: ${error?.message}`);
      }
    }

    return NextResponse.json({
      imported,
      errors: errors.length > 0 ? errors : null,
    });
  } catch (error) {
    console.error('Error importing data:', error);
    return NextResponse.json(
      { error: 'Erro ao importar dados' },
      { status: 500 }
    );
  }
}
