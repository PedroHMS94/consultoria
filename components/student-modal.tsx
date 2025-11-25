'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/formatters';

interface Student {
  id?: string;
  name: string;
  email?: string;
  planTypeId: string;
  planStartDate: string;
  planExpiryDate: string;
  trainingStartDate?: string;
  trainingExpiryDate?: string;
  trainingPhaseId?: string;
  trainingStatus: string;
  paymentStatus: string;
  paymentMethod?: string;
  paymentDate?: string;
  discount: number;
  discountType: string;
  trainingAccessId?: string;
  observations?: string;
}

interface StudentModalProps {
  mode: 'add' | 'edit' | 'view';
  student: any;
  planTypes: any[];
  trainingPhases: any[];
  onClose: () => void;
}

export function StudentModal({ mode, student, planTypes, trainingPhases, onClose }: StudentModalProps) {
  const [formData, setFormData] = useState<Student>({
    name: '',
    email: '',
    planTypeId: '',
    planStartDate: '',
    planExpiryDate: '',
    trainingStartDate: '',
    trainingExpiryDate: '',
    trainingPhaseId: '',
    trainingStatus: 'Não Iniciado',
    paymentStatus: 'Pendente',
    paymentMethod: '',
    paymentDate: '',
    discount: 0,
    discountType: 'valor',
    trainingAccessId: '',
    observations: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student && (mode === 'edit' || mode === 'view')) {
      setFormData({
        name: student?.name ?? '',
        email: student?.email ?? '',
        planTypeId: student?.planType?.id ?? '',
        planStartDate: student?.planStartDate ? new Date(student.planStartDate).toISOString().split('T')[0] : '',
        planExpiryDate: student?.planExpiryDate ? new Date(student.planExpiryDate).toISOString().split('T')[0] : '',
        trainingStartDate: student?.trainingStartDate ? new Date(student.trainingStartDate).toISOString().split('T')[0] : '',
        trainingExpiryDate: student?.trainingExpiryDate ? new Date(student.trainingExpiryDate).toISOString().split('T')[0] : '',
        trainingPhaseId: student?.trainingPhase?.id ?? '',
        trainingStatus: student?.trainingStatus ?? 'Não Iniciado',
        paymentStatus: student?.paymentStatus ?? 'Pendente',
        paymentMethod: student?.paymentMethod ?? '',
        paymentDate: student?.paymentDate ? new Date(student.paymentDate).toISOString().split('T')[0] : '',
        discount: student?.discount ?? 0,
        discountType: student?.discountType ?? 'valor',
        trainingAccessId: student?.trainingAccessId ?? '',
        observations: student?.observations ?? '',
      });
    }
  }, [student, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = mode === 'add' ? '/api/students' : `/api/students/${student?.id}`;
      const method = mode === 'add' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save student');

      toast.success(mode === 'add' ? 'Aluno adicionado com sucesso' : 'Aluno atualizado com sucesso');
      onClose();
    } catch (error) {
      console.error('Error saving student:', error);
      toast.error('Erro ao salvar aluno');
    } finally {
      setLoading(false);
    }
  };

  const isReadOnly = mode === 'view';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {mode === 'add' && 'Adicionar Aluno'}
            {mode === 'edit' && 'Editar Aluno'}
            {mode === 'view' && 'Visualizar Aluno'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Informações Pessoais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome do Aluno *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e?.target?.value ?? '' })}
                  required
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <Label htmlFor="email">E-mail de Contato</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e?.target?.value ?? '' })}
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </div>

          {/* Plan Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Informações do Plano</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="planTypeId">Plano Contratado *</Label>
                <Select
                  id="planTypeId"
                  value={formData.planTypeId}
                  onChange={(e) => setFormData({ ...formData, planTypeId: e?.target?.value ?? '' })}
                  required
                  disabled={isReadOnly}
                >
                  <option value="">Selecione um plano</option>
                  {planTypes?.map?.((plan) => (
                    <option key={plan?.id} value={plan?.id}>
                      {plan?.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="planStartDate">Data de Início do Plano *</Label>
                <Input
                  id="planStartDate"
                  type="date"
                  value={formData.planStartDate}
                  onChange={(e) => setFormData({ ...formData, planStartDate: e?.target?.value ?? '' })}
                  required
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <Label htmlFor="planExpiryDate">Data de Vencimento do Plano *</Label>
                <Input
                  id="planExpiryDate"
                  type="date"
                  value={formData.planExpiryDate}
                  onChange={(e) => setFormData({ ...formData, planExpiryDate: e?.target?.value ?? '' })}
                  required
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </div>

          {/* Training Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Informações do Treino</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="trainingStartDate">Data de Início do Treino</Label>
                <Input
                  id="trainingStartDate"
                  type="date"
                  value={formData.trainingStartDate}
                  onChange={(e) => setFormData({ ...formData, trainingStartDate: e?.target?.value ?? '' })}
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <Label htmlFor="trainingExpiryDate">Data de Vencimento do Treino</Label>
                <Input
                  id="trainingExpiryDate"
                  type="date"
                  value={formData.trainingExpiryDate}
                  onChange={(e) => setFormData({ ...formData, trainingExpiryDate: e?.target?.value ?? '' })}
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <Label htmlFor="trainingPhaseId">Fase do Treino</Label>
                <Select
                  id="trainingPhaseId"
                  value={formData.trainingPhaseId}
                  onChange={(e) => setFormData({ ...formData, trainingPhaseId: e?.target?.value ?? '' })}
                  disabled={isReadOnly}
                >
                  <option value="">Selecione uma fase</option>
                  {trainingPhases?.map?.((phase) => (
                    <option key={phase?.id} value={phase?.id}>
                      {phase?.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="trainingStatus">Status do Treino *</Label>
                <Select
                  id="trainingStatus"
                  value={formData.trainingStatus}
                  onChange={(e) => setFormData({ ...formData, trainingStatus: e?.target?.value ?? '' })}
                  required
                  disabled={isReadOnly}
                >
                  <option value="Não Iniciado">Não Iniciado</option>
                  <option value="Em Andamento">Em Andamento</option>
                  <option value="Completado">Completado</option>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="trainingAccessId">ID de Acesso ao Treinamento</Label>
                <Input
                  id="trainingAccessId"
                  value={formData.trainingAccessId}
                  onChange={(e) => setFormData({ ...formData, trainingAccessId: e?.target?.value ?? '' })}
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Informações de Pagamento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="paymentStatus">Status do Pagamento *</Label>
                <Select
                  id="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={(e) => setFormData({ ...formData, paymentStatus: e?.target?.value ?? '' })}
                  required
                  disabled={isReadOnly}
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Pago">Pago</option>
                  <option value="Vencido">Vencido</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
                <Select
                  id="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e?.target?.value ?? '' })}
                  disabled={isReadOnly}
                >
                  <option value="">Selecione</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Boleto Bancário">Boleto Bancário</option>
                  <option value="PIX">PIX</option>
                  <option value="Transferência">Transferência</option>
                  <option value="Dinheiro">Dinheiro</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="paymentDate">Data de Pagamento</Label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) => setFormData({ ...formData, paymentDate: e?.target?.value ?? '' })}
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <Label htmlFor="discount">Desconto</Label>
                <div className="flex gap-2">
                  <Input
                    id="discount"
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: parseFloat(e?.target?.value ?? '0') })}
                    disabled={isReadOnly}
                    min="0"
                    step="0.01"
                  />
                  <Select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e?.target?.value ?? '' })}
                    disabled={isReadOnly}
                    className="w-32"
                  >
                    <option value="valor">R$</option>
                    <option value="percentual">%</option>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Observations */}
          <div>
            <Label htmlFor="observations">Observações</Label>
            <textarea
              id="observations"
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e?.target?.value ?? '' })}
              disabled={isReadOnly}
              rows={4}
              className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              {isReadOnly ? 'Fechar' : 'Cancelar'}
            </Button>
            {!isReadOnly && (
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
