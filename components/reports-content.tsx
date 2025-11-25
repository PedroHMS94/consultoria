'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatCurrency, getDaysUntilExpiry, getExpiryStatusVariant } from '@/lib/formatters';
import { Calendar, DollarSign, TrendingUp, Users } from 'lucide-react';
import toast from 'react-hot-toast';

interface Student {
  id: string;
  name: string;
  email?: string;
  planType: { name: string; color: string };
  planStartDate: string;
  planExpiryDate: string;
  paymentStatus: string;
  discount: number;
  discountType: string;
}

export function ReportsContent() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filterType, setFilterType] = useState('expiring');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students');
      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Erro ao carregar alunos');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredStudents = () => {
    const now = new Date();
    
    switch (filterType) {
      case 'expiring':
        return students.filter((s) => {
          const days = getDaysUntilExpiry(s?.planExpiryDate ?? '');
          return days > 0 && days <= 30;
        }).sort((a, b) => 
          new Date(a?.planExpiryDate ?? '').getTime() - new Date(b?.planExpiryDate ?? '').getTime()
        );
      
      case 'expired':
        return students.filter((s) => {
          const days = getDaysUntilExpiry(s?.planExpiryDate ?? '');
          return days <= 0;
        }).sort((a, b) => 
          new Date(b?.planExpiryDate ?? '').getTime() - new Date(a?.planExpiryDate ?? '').getTime()
        );
      
      case 'pending_payment':
        return students.filter((s) => s?.paymentStatus === 'Pendente');
      
      case 'overdue_payment':
        return students.filter((s) => s?.paymentStatus === 'Vencido');
      
      default:
        return students;
    }
  };

  const filteredStudents = getFilteredStudents();

  // Calculate metrics
  const expiringCount = students.filter((s) => {
    const days = getDaysUntilExpiry(s?.planExpiryDate ?? '');
    return days > 0 && days <= 30;
  }).length;

  const expiredCount = students.filter((s) => {
    const days = getDaysUntilExpiry(s?.planExpiryDate ?? '');
    return days <= 0;
  }).length;

  const pendingPayments = students.filter((s) => s?.paymentStatus === 'Pendente').length;
  const overduePayments = students.filter((s) => s?.paymentStatus === 'Vencido').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-gray-600 mt-1">Análises detalhadas e relatórios do negócio</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Planos Vencendo</p>
                <p className="text-3xl font-bold mt-2 text-orange-600">{expiringCount}</p>
                <p className="text-xs text-gray-500 mt-1">Próximos 30 dias</p>
              </div>
              <div className="bg-orange-50 rounded-full p-3">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Planos Vencidos</p>
                <p className="text-3xl font-bold mt-2 text-red-600">{expiredCount}</p>
                <p className="text-xs text-gray-500 mt-1">Requer atenção</p>
              </div>
              <div className="bg-red-50 rounded-full p-3">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pagamentos Pendentes</p>
                <p className="text-3xl font-bold mt-2 text-yellow-600">{pendingPayments}</p>
                <p className="text-xs text-gray-500 mt-1">Aguardando pagamento</p>
              </div>
              <div className="bg-yellow-50 rounded-full p-3">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pagamentos Vencidos</p>
                <p className="text-3xl font-bold mt-2 text-red-600">{overduePayments}</p>
                <p className="text-xs text-gray-500 mt-1">Cobrança necessária</p>
              </div>
              <div className="bg-red-50 rounded-full p-3">
                <Users className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Relatório Detalhado</CardTitle>
              <CardDescription>Visualize dados específicos por categoria</CardDescription>
            </div>
            <Select value={filterType} onChange={(e) => setFilterType(e?.target?.value ?? '')} className="w-64">
              <option value="expiring">Planos Vencendo (30 dias)</option>
              <option value="expired">Planos Vencidos</option>
              <option value="pending_payment">Pagamentos Pendentes</option>
              <option value="overdue_payment">Pagamentos Vencidos</option>
              <option value="all">Todos os Alunos</option>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Nome</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Plano</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Vencimento</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Status Pag.</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Desconto</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-600">
                      Nenhum registro encontrado para este filtro
                    </td>
                  </tr>
                ) : (
                  filteredStudents?.map?.((student) => {
                    const daysUntilExpiry = getDaysUntilExpiry(student?.planExpiryDate ?? '');
                    const expiryVariant = getExpiryStatusVariant(daysUntilExpiry);

                    return (
                      <tr key={student?.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{student?.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{student?.email || '-'}</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant="default"
                            style={{ backgroundColor: student?.planType?.color, color: '#fff' }}
                          >
                            {student?.planType?.name}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-900">{formatDate(student?.planExpiryDate)}</div>
                          <Badge variant={expiryVariant} className="mt-1">
                            {daysUntilExpiry <= 0
                              ? 'Vencido'
                              : daysUntilExpiry === 1
                              ? '1 dia'
                              : `${daysUntilExpiry} dias`}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              student?.paymentStatus === 'Pago'
                                ? 'success'
                                : student?.paymentStatus === 'Pendente'
                                ? 'warning'
                                : 'danger'
                            }
                          >
                            {student?.paymentStatus}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {student?.discount > 0
                            ? student?.discountType === 'percentual'
                              ? `${student?.discount}%`
                              : formatCurrency(student?.discount)
                            : '-'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
