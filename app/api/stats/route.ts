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

    const students = await prisma.student.findMany({
      include: {
        planType: true,
        trainingPhase: true,
      },
    });

    const totalStudents = students.length;
    
    // Payment stats
    //const paidCount = students.filter(s => s.paymentStatus === 'Pago').length;
    //const pendingCount = students.filter(s => s.paymentStatus === 'Pendente').length;
    //const overdueCount = students.filter(s => s.paymentStatus === 'Vencido').length;
	const paidCount = students.filter((s: any) => s.paymentStatus === 'Pago').length;
	const pendingCount = students.filter((s: any) => s.paymentStatus === 'Pendente').length;
	const overdueCount = students.filter((s: any) => s.paymentStatus === 'Vencido').length;

    // Training status stats
    //const completedCount = students.filter(s => s.trainingStatus === 'Completado').length;
    //const inProgressCount = students.filter(s => s.trainingStatus === 'Em Andamento').length;
    //const notStartedCount = students.filter(s => s.trainingStatus === 'Não Iniciado').length;
	const completedCount = students.filter((s: any) => s.trainingStatus === 'Completado').length;
const inProgressCount = students.filter((s: any) => s.trainingStatus === 'Em Andamento').length;
const notStartedCount = students.filter((s: any) => s.trainingStatus === 'Não Iniciado').length;

    // Plan expiry alerts
    const now = new Date();
    const expiringSoon = students.filter((s: any) => {
      const diff = s.planExpiryDate.getTime() - now.getTime();
      const days = diff / (1000 * 60 * 60 * 24);
      return days > 0 && days <= 30;
    });

    const expiringCritical = expiringSoon.filter((s: any) => {
      const diff = s.planExpiryDate.getTime() - now.getTime();
      const days = diff / (1000 * 60 * 60 * 24);
      return days <= 7;
    });

    const expiringWarning = expiringSoon.filter((s: any) => {
      const diff = s.planExpiryDate.getTime() - now.getTime();
      const days = diff / (1000 * 60 * 60 * 24);
      return days > 7 && days <= 15;
    });

    // Plan distribution
    const planDistribution = students.reduce((acc: any, student) => {
      const planName = student?.planType?.name;
      if (planName) {
        acc[planName] = (acc[planName] || 0) + 1;
      }
      return acc;
    }, {});

    // Training phase distribution
    const phaseDistribution = students.reduce((acc: any, student) => {
      const phaseName = student?.trainingPhase?.name || 'Sem Fase';
      acc[phaseName] = (acc[phaseName] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      totalStudents,
      paymentStats: {
        paid: paidCount,
        pending: pendingCount,
        overdue: overdueCount,
      },
      trainingStats: {
        completed: completedCount,
        inProgress: inProgressCount,
        notStarted: notStartedCount,
      },
      expiryAlerts: {
        total: expiringSoon.length,
        critical: expiringCritical.length,
        warning: expiringWarning.length,
        safe: totalStudents - expiringSoon.length,
      },
      planDistribution,
      phaseDistribution,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    );
  }
}
