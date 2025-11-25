'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate, getDaysUntilExpiry, getExpiryStatusVariant, getPaymentStatusVariant } from '@/lib/formatters';
import { StudentModal } from './student-modal';

interface Student {
  id: string;
  name: string;
  email?: string;
  planType: { name: string; color: string };
  planStartDate: string;
  planExpiryDate: string;
  trainingPhase?: { name: string; color: string };
  trainingStatus: string;
  paymentStatus: string;
  paymentMethod?: string;
  discount: number;
  trainingAccessId?: string;
  observations?: string;
}

interface PlanType {
  id: string;
  name: string;
}

interface TrainingPhase {
  id: string;
  name: string;
}

export function StudentsContent() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [planTypes, setPlanTypes] = useState<PlanType[]>([]);
  const [trainingPhases, setTrainingPhases] = useState<TrainingPhase[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');

  // Filters
  const [searchName, setSearchName] = useState('');
  const [filterPlan, setFilterPlan] = useState('');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('');
  const [filterTrainingStatus, setFilterTrainingStatus] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [students, searchName, filterPlan, filterPaymentStatus, filterTrainingStatus]);

  const fetchData = async () => {
    try {
      const [studentsRes, planTypesRes, phasesRes] = await Promise.all([
        fetch('/api/students'),
        fetch('/api/plan-types'),
        fetch('/api/training-phases'),
      ]);

      if (studentsRes.ok) setStudents(await studentsRes.json());
      if (planTypesRes.ok) setPlanTypes(await planTypesRes.json());
      if (phasesRes.ok) setTrainingPhases(await phasesRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...students];

    if (searchName) {
      filtered = filtered.filter((s) =>
        s?.name?.toLowerCase?.()?.includes?.(searchName?.toLowerCase?.() ?? '') ?? false
      );
    }

    if (filterPlan) {
      filtered = filtered.filter((s) => s?.planType?.name === filterPlan);
    }

    if (filterPaymentStatus) {
      filtered = filtered.filter((s) => s?.paymentStatus === filterPaymentStatus);
    }

    if (filterTrainingStatus) {
      filtered = filtered.filter((s) => s?.trainingStatus === filterTrainingStatus);
    }

    setFilteredStudents(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este aluno?')) return;

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      toast.success('Aluno deletado com sucesso');
      fetchData();
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Erro ao deletar aluno');
    }
  };

  const openModal = (mode: 'add' | 'edit' | 'view', student?: Student) => {
    setModalMode(mode);
    setSelectedStudent(student ?? null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando alunos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Alunos</h1>
          <p className="text-gray-600 mt-1">Gerenciar e visualizar todos os alunos cadastrados</p>
        </div>
        <Button onClick={() => openModal('add')} className="shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Aluno
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre os alunos por diferentes critérios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Buscar por nome</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nome do aluno"
                  value={searchName}
                  onChange={(e) => setSearchName(e?.target?.value ?? '')}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo de Plano</label>
              <Select value={filterPlan} onChange={(e) => setFilterPlan(e?.target?.value ?? '')}>
                <option value="">Todos os planos</option>
                {planTypes?.map?.((plan) => (
                  <option key={plan?.id} value={plan?.name}>
                    {plan?.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Status de Pagamento</label>
              <Select
                value={filterPaymentStatus}
                onChange={(e) => setFilterPaymentStatus(e?.target?.value ?? '')}
              >
                <option value="">Todos os status</option>
                <option value="Pago">Pago</option>
                <option value="Pendente">Pendente</option>
                <option value="Vencido">Vencido</option>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Status de Treino</label>
              <Select
                value={filterTrainingStatus}
                onChange={(e) => setFilterTrainingStatus(e?.target?.value ?? '')}
              >
                <option value="">Todos os status</option>
                <option value="Completado">Completado</option>
                <option value="Em Andamento">Em Andamento</option>
                <option value="Não Iniciado">Não Iniciado</option>
              </Select>
            </div>
          </div>
          {(searchName || filterPlan || filterPaymentStatus || filterTrainingStatus) && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchName('');
                  setFilterPlan('');
                  setFilterPaymentStatus('');
                  setFilterTrainingStatus('');
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Alunos ({filteredStudents?.length ?? 0})</CardTitle>
          <CardDescription>
            {filteredStudents?.length === students?.length
              ? 'Todos os alunos cadastrados'
              : `Mostrando ${filteredStudents?.length ?? 0} de ${students?.length ?? 0} alunos`}
          </CardDescription>
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
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Pagamento</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Treino</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-600">
                      Nenhum aluno encontrado
                    </td>
                  </tr>
                ) : (
                  filteredStudents?.map?.((student) => {
                    const daysUntilExpiry = getDaysUntilExpiry(student?.planExpiryDate ?? '');
                    const expiryVariant = getExpiryStatusVariant(daysUntilExpiry);
                    const paymentVariant = getPaymentStatusVariant(student?.paymentStatus ?? '');

                    return (
                      <tr key={student?.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{student?.name}</div>
                          {student?.trainingAccessId && (
                            <div className="text-xs text-gray-500">ID: {student?.trainingAccessId}</div>
                          )}
                        </td>
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
                          <Badge variant={paymentVariant}>{student?.paymentStatus}</Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{student?.trainingStatus}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openModal('view', student)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openModal('edit', student)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(student?.id ?? '')}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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

      {isModalOpen && (
        <StudentModal
          mode={modalMode}
          student={selectedStudent}
          planTypes={planTypes}
          trainingPhases={trainingPhases}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
