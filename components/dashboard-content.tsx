'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  CreditCard,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import { DashboardCharts } from './dashboard-charts';
import toast from 'react-hot-toast';

interface Stats {
  totalStudents: number;
  paymentStats: {
    paid: number;
    pending: number;
    overdue: number;
  };
  trainingStats: {
    completed: number;
    inProgress: number;
    notStarted: number;
  };
  expiryAlerts: {
    total: number;
    critical: number;
    warning: number;
    safe: number;
  };
  planDistribution: Record<string, number>;
  phaseDistribution: Record<string, number>;
}

export function DashboardContent() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Erro ao carregar estatísticas</p>
      </div>
    );
  }

  const kpiCards = [
    {
      title: 'Total de Alunos',
      value: stats.totalStudents,
      icon: Users,
      color: 'from-blue-600 to-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Pagamentos Recebidos',
      value: stats.paymentStats.paid,
      icon: CheckCircle,
      color: 'from-green-600 to-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pagamentos Pendentes',
      value: stats.paymentStats.pending,
      icon: Clock,
      color: 'from-yellow-600 to-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Pagamentos Vencidos',
      value: stats.paymentStats.overdue,
      icon: XCircle,
      color: 'from-red-600 to-red-500',
      bgColor: 'bg-red-50',
    },
  ];

  const expiryAlerts = [
    {
      label: 'Planos Vencendo (Crítico)',
      value: stats.expiryAlerts.critical,
      description: 'Vencem em até 7 dias',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    {
      label: 'Planos Vencendo (Atenção)',
      value: stats.expiryAlerts.warning,
      description: 'Vencem em 8-15 dias',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    {
      label: 'Planos Vencendo (Aviso)',
      value: stats.expiryAlerts.total - stats.expiryAlerts.critical - stats.expiryAlerts.warning,
      description: 'Vencem em 16-30 dias',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      label: 'Planos em Dia',
      value: stats.expiryAlerts.safe,
      description: 'Mais de 30 dias',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Visão geral do seu negócio de consultoria</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                    <p className="text-3xl font-bold mt-2">{kpi.value}</p>
                  </div>
                  <div className={`${kpi.bgColor} rounded-full p-3`}>
                    <Icon className={`h-6 w-6 bg-gradient-to-br ${kpi.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Expiry Alerts */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            Status de Vencimento dos Planos
          </CardTitle>
          <CardDescription>Sistema de alertas por proximidade de vencimento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {expiryAlerts.map((alert, index) => (
              <div
                key={index}
                className={`${alert.bgColor} ${alert.borderColor} border-2 rounded-lg p-4 hover:shadow-md transition-shadow`}
              >
                <div className={`text-3xl font-bold ${alert.color} mb-1`}>{alert.value}</div>
                <div className="font-medium text-gray-900 text-sm">{alert.label}</div>
                <div className="text-xs text-gray-600 mt-1">{alert.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <DashboardCharts stats={stats} />

      {/* Training Progress */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Progresso dos Alunos
          </CardTitle>
          <CardDescription>Status do treino dos alunos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <div className="text-3xl font-bold text-green-600">{stats.trainingStats.completed}</div>
              <div className="font-medium text-gray-900 text-sm">Treinos Completados</div>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-600">{stats.trainingStats.inProgress}</div>
              <div className="font-medium text-gray-900 text-sm">Em Andamento</div>
            </div>
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
              <div className="text-3xl font-bold text-gray-600">{stats.trainingStats.notStarted}</div>
              <div className="font-medium text-gray-900 text-sm">Não Iniciados</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
