'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Settings as SettingsIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface PlanType {
  id: string;
  name: string;
  color: string;
  order: number;
}

interface TrainingPhase {
  id: string;
  name: string;
  color: string;
  order: number;
}

export function SettingsContent() {
  const [planTypes, setPlanTypes] = useState<PlanType[]>([]);
  const [trainingPhases, setTrainingPhases] = useState<TrainingPhase[]>([]);
  const [loading, setLoading] = useState(true);

  // Plan Type Form
  const [planForm, setPlanForm] = useState({ name: '', color: '#3B82F6', order: 0 });
  const [editingPlan, setEditingPlan] = useState<string | null>(null);

  // Training Phase Form
  const [phaseForm, setPhaseForm] = useState({ name: '', color: '#10B981', order: 0 });
  const [editingPhase, setEditingPhase] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [planTypesRes, phasesRes] = await Promise.all([
        fetch('/api/plan-types'),
        fetch('/api/training-phases'),
      ]);

      if (planTypesRes.ok) setPlanTypes(await planTypesRes.json());
      if (phasesRes.ok) setTrainingPhases(await phasesRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlanType = async () => {
    if (!planForm?.name?.trim?.()) {
      toast.error('Nome do plano é obrigatório');
      return;
    }

    try {
      const response = await fetch('/api/plan-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planForm),
      });

      if (!response.ok) throw new Error('Failed to add plan type');

      toast.success('Tipo de plano adicionado com sucesso');
      setPlanForm({ name: '', color: '#3B82F6', order: 0 });
      fetchData();
    } catch (error) {
      console.error('Error adding plan type:', error);
      toast.error('Erro ao adicionar tipo de plano');
    }
  };

  const handleUpdatePlanType = async (id: string) => {
    try {
      const response = await fetch(`/api/plan-types/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planForm),
      });

      if (!response.ok) throw new Error('Failed to update plan type');

      toast.success('Tipo de plano atualizado com sucesso');
      setEditingPlan(null);
      setPlanForm({ name: '', color: '#3B82F6', order: 0 });
      fetchData();
    } catch (error) {
      console.error('Error updating plan type:', error);
      toast.error('Erro ao atualizar tipo de plano');
    }
  };

  const handleDeletePlanType = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este tipo de plano?')) return;

    try {
      const response = await fetch(`/api/plan-types/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete plan type');

      toast.success('Tipo de plano deletado com sucesso');
      fetchData();
    } catch (error) {
      console.error('Error deleting plan type:', error);
      toast.error('Erro ao deletar tipo de plano');
    }
  };

  const handleAddTrainingPhase = async () => {
    if (!phaseForm?.name?.trim?.()) {
      toast.error('Nome da fase é obrigatório');
      return;
    }

    try {
      const response = await fetch('/api/training-phases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(phaseForm),
      });

      if (!response.ok) throw new Error('Failed to add training phase');

      toast.success('Fase de treino adicionada com sucesso');
      setPhaseForm({ name: '', color: '#10B981', order: 0 });
      fetchData();
    } catch (error) {
      console.error('Error adding training phase:', error);
      toast.error('Erro ao adicionar fase de treino');
    }
  };

  const handleUpdateTrainingPhase = async (id: string) => {
    try {
      const response = await fetch(`/api/training-phases/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(phaseForm),
      });

      if (!response.ok) throw new Error('Failed to update training phase');

      toast.success('Fase de treino atualizada com sucesso');
      setEditingPhase(null);
      setPhaseForm({ name: '', color: '#10B981', order: 0 });
      fetchData();
    } catch (error) {
      console.error('Error updating training phase:', error);
      toast.error('Erro ao atualizar fase de treino');
    }
  };

  const handleDeleteTrainingPhase = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta fase de treino?')) return;

    try {
      const response = await fetch(`/api/training-phases/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete training phase');

      toast.success('Fase de treino deletada com sucesso');
      fetchData();
    } catch (error) {
      console.error('Error deleting training phase:', error);
      toast.error('Erro ao deletar fase de treino');
    }
  };

  const startEditPlan = (plan: PlanType) => {
    setEditingPlan(plan?.id);
    setPlanForm({ name: plan?.name, color: plan?.color, order: plan?.order });
  };

  const startEditPhase = (phase: TrainingPhase) => {
    setEditingPhase(phase?.id);
    setPhaseForm({ name: phase?.name, color: phase?.color, order: phase?.order });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-1">Gerenciar tipos de planos e fases de treino</p>
      </div>

      {/* Plan Types */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-blue-600" />
            Tipos de Planos
          </CardTitle>
          <CardDescription>
            Adicione ou edite os tipos de planos disponíveis para contratação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Form */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold mb-3">
              {editingPlan ? 'Editar Tipo de Plano' : 'Adicionar Novo Tipo de Plano'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="plan-name">Nome do Plano</Label>
                <Input
                  id="plan-name"
                  value={planForm.name}
                  onChange={(e) => setPlanForm({ ...planForm, name: e?.target?.value ?? '' })}
                  placeholder="Ex: Mensal, Trimestral"
                />
              </div>
              <div>
                <Label htmlFor="plan-color">Cor</Label>
                <div className="flex gap-2">
                  <Input
                    id="plan-color"
                    type="color"
                    value={planForm.color}
                    onChange={(e) => setPlanForm({ ...planForm, color: e?.target?.value ?? '' })}
                    className="w-20"
                  />
                  <Input
                    value={planForm.color}
                    onChange={(e) => setPlanForm({ ...planForm, color: e?.target?.value ?? '' })}
                    placeholder="#3B82F6"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="plan-order">Ordem</Label>
                <Input
                  id="plan-order"
                  type="number"
                  value={planForm.order}
                  onChange={(e) => setPlanForm({ ...planForm, order: parseInt(e?.target?.value ?? '0') })}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              {editingPlan ? (
                <>
                  <Button onClick={() => handleUpdatePlanType(editingPlan)} size="sm">
                    Atualizar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingPlan(null);
                      setPlanForm({ name: '', color: '#3B82F6', order: 0 });
                    }}
                  >
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button onClick={handleAddPlanType} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              )}
            </div>
          </div>

          {/* List */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Tipos de Planos Cadastrados</h3>
            <div className="space-y-2">
              {planTypes?.map?.((plan) => (
                <div
                  key={plan?.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: plan?.color }}
                    />
                    <span className="font-medium">{plan?.name}</span>
                    <span className="text-xs text-gray-500">Ordem: {plan?.order}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => startEditPlan(plan)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeletePlanType(plan?.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training Phases */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-orange-600" />
            Fases de Treino
          </CardTitle>
          <CardDescription>
            Adicione ou edite as fases de treino disponíveis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Form */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold mb-3">
              {editingPhase ? 'Editar Fase de Treino' : 'Adicionar Nova Fase de Treino'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="phase-name">Nome da Fase</Label>
                <Input
                  id="phase-name"
                  value={phaseForm.name}
                  onChange={(e) => setPhaseForm({ ...phaseForm, name: e?.target?.value ?? '' })}
                  placeholder="Ex: Adaptação, Hipertrofia"
                />
              </div>
              <div>
                <Label htmlFor="phase-color">Cor</Label>
                <div className="flex gap-2">
                  <Input
                    id="phase-color"
                    type="color"
                    value={phaseForm.color}
                    onChange={(e) => setPhaseForm({ ...phaseForm, color: e?.target?.value ?? '' })}
                    className="w-20"
                  />
                  <Input
                    value={phaseForm.color}
                    onChange={(e) => setPhaseForm({ ...phaseForm, color: e?.target?.value ?? '' })}
                    placeholder="#10B981"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phase-order">Ordem</Label>
                <Input
                  id="phase-order"
                  type="number"
                  value={phaseForm.order}
                  onChange={(e) => setPhaseForm({ ...phaseForm, order: parseInt(e?.target?.value ?? '0') })}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              {editingPhase ? (
                <>
                  <Button onClick={() => handleUpdateTrainingPhase(editingPhase)} size="sm">
                    Atualizar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingPhase(null);
                      setPhaseForm({ name: '', color: '#10B981', order: 0 });
                    }}
                  >
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button onClick={handleAddTrainingPhase} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              )}
            </div>
          </div>

          {/* List */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Fases de Treino Cadastradas</h3>
            <div className="space-y-2">
              {trainingPhases?.map?.((phase) => (
                <div
                  key={phase?.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: phase?.color }}
                    />
                    <span className="font-medium">{phase?.name}</span>
                    <span className="text-xs text-gray-500">Ordem: {phase?.order}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => startEditPhase(phase)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTrainingPhase(phase?.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
