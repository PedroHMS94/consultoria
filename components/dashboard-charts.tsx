'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';

interface Stats {
  planDistribution: Record<string, number>;
  phaseDistribution: Record<string, number>;
  paymentStats: {
    paid: number;
    pending: number;
    overdue: number;
  };
}

interface DashboardChartsProps {
  stats: Stats;
}

const COLORS = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#80D8C3', '#A19AD3', '#72BF78', '#FF6363'];

export function DashboardCharts({ stats }: DashboardChartsProps) {
  const planData = Object.entries(stats?.planDistribution ?? {}).map(([name, value]) => ({
    name,
    value,
  }));

  const phaseData = Object.entries(stats?.phaseDistribution ?? {}).map(([name, value]) => ({
    name,
    value,
  }));

  const paymentData = [
    { name: 'Pago', value: stats?.paymentStats?.paid ?? 0, fill: '#10B981' },
    { name: 'Pendente', value: stats?.paymentStats?.pending ?? 0, fill: '#F59E0B' },
    { name: 'Vencido', value: stats?.paymentStats?.overdue ?? 0, fill: '#EF4444' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Plan Distribution */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-blue-600" />
            Distribuição por Plano
          </CardTitle>
          <CardDescription>Total de alunos por tipo de plano contratado</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={planData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry?.name}: ${entry?.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {planData?.map?.((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ fontSize: 11 }}
                formatter={(value) => [`${value} alunos`, '']}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} verticalAlign="top" />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Payment Status */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-600" />
            Status de Pagamento
          </CardTitle>
          <CardDescription>Distribuição dos pagamentos por status</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paymentData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <XAxis
                dataKey="name"
                tickLine={false}
                tick={{ fontSize: 10 }}
                label={{ value: 'Status', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fontSize: 11 } }}
              />
              <YAxis
                tickLine={false}
                tick={{ fontSize: 10 }}
                label={{ value: 'Quantidade', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
              />
              <Tooltip
                contentStyle={{ fontSize: 11 }}
                formatter={(value) => [`${value} alunos`, 'Quantidade']}
              />
              <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]}>
                {paymentData?.map?.((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Training Phase Distribution */}
      <Card className="shadow-lg lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-orange-600" />
            Distribuição por Fase de Treino
          </CardTitle>
          <CardDescription>Quantidade de alunos em cada fase do treino</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={phaseData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <XAxis
                dataKey="name"
                tickLine={false}
                tick={{ fontSize: 10 }}
                label={{ value: 'Fase do Treino', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fontSize: 11 } }}
              />
              <YAxis
                tickLine={false}
                tick={{ fontSize: 10 }}
                label={{ value: 'Quantidade de Alunos', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
              />
              <Tooltip
                contentStyle={{ fontSize: 11 }}
                formatter={(value) => [`${value} alunos`, 'Quantidade']}
              />
              <Bar dataKey="value" fill="#F97316" radius={[8, 8, 0, 0]}>
                {phaseData?.map?.((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
