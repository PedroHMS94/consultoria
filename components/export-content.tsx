'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Download, FileDown } from 'lucide-react';
import toast from 'react-hot-toast';

export function ExportContent() {
  const [exportType, setExportType] = useState('all');
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (exportType !== 'all') {
        params.append('type', exportType);
      }

      const response = await fetch(`/api/export?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to export');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `alunos_${exportType}_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success('Dados exportados com sucesso!');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Erro ao exportar dados');
    } finally {
      setLoading(false);
    }
  };

  const exportOptions = [
    { value: 'all', label: 'Todos os Alunos', description: 'Exportar todos os alunos cadastrados' },
    { value: 'active', label: 'Alunos Ativos', description: 'Apenas alunos com planos ativos' },
    { value: 'expiring', label: 'Planos Vencendo', description: 'Alunos com planos vencendo em 30 dias' },
    { value: 'paid', label: 'Pagamentos em Dia', description: 'Apenas alunos com pagamento confirmado' },
    { value: 'pending', label: 'Pagamentos Pendentes', description: 'Alunos com pagamento pendente' },
    { value: 'overdue', label: 'Pagamentos Vencidos', description: 'Alunos com pagamento vencido' },
  ];

  const selectedOption = exportOptions.find((opt) => opt?.value === exportType);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Exportar Dados</h1>
        <p className="text-gray-600 mt-1">Exporte dados dos alunos em formato CSV</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5 text-blue-600" />
            Exportação de Dados
          </CardTitle>
          <CardDescription>
            Selecione o tipo de dados que deseja exportar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Tipo de Exportação</label>
            <Select value={exportType} onChange={(e) => setExportType(e?.target?.value ?? '')} className="w-full">
              {exportOptions?.map?.((option) => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </Select>
            {selectedOption && (
              <p className="text-sm text-gray-600 mt-2">{selectedOption?.description}</p>
            )}
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">O arquivo CSV incluirá:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
              <li>Nome do aluno</li>
              <li>E-mail de contato</li>
              <li>Tipo de plano contratado</li>
              <li>Datas de início e vencimento do plano</li>
              <li>Informações de treino (datas, fase, status)</li>
              <li>Status e forma de pagamento</li>
              <li>Descontos aplicados</li>
              <li>Observações e ID de acesso</li>
            </ul>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t">
            <Button onClick={handleExport} disabled={loading} className="shadow-md">
              <Download className="h-4 w-4 mr-2" />
              {loading ? 'Exportando...' : 'Exportar CSV'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Export Statistics */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Estatísticas de Exportação</CardTitle>
          <CardDescription>Informações sobre os dados disponíveis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exportOptions.slice(1).map((option) => (
              <div
                key={option?.value}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                onClick={() => setExportType(option?.value)}
              >
                <div className="font-medium text-gray-900">{option?.label}</div>
                <div className="text-xs text-gray-600 mt-1">{option?.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
