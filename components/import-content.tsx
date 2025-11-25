'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUp, Download, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export function ImportContent() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e?.target?.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      previewFile(selectedFile);
    }
  };

  const previewFile = async (file: File) => {
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line?.trim?.());
      const headers = lines?.[0]?.split?.(',');
      const previewData = lines.slice(1, 6).map(line => {
        const values = line?.split?.(',');
        const obj: any = {};
        headers?.forEach?.((header, index) => {
          obj[header?.trim?.()] = values?.[index]?.trim?.();
        });
        return obj;
      });
      setPreview(previewData);
    } catch (error) {
      console.error('Error previewing file:', error);
      toast.error('Erro ao visualizar arquivo');
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Selecione um arquivo');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.error || 'Failed to import');
      }

      const result = await response.json();
      toast.success(`${result?.imported ?? 0} alunos importados com sucesso!`);
      setFile(null);
      setPreview([]);
    } catch (error: any) {
      console.error('Error importing file:', error);
      toast.error(error?.message || 'Erro ao importar dados');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = `nome,email,plano,data_inicio_plano,data_vencimento_plano,status_pagamento,forma_pagamento,data_pagamento,desconto,tipo_desconto,fase_treino,status_treino,id_acesso,observacoes
João Silva,joao@email.com,Mensal,2024-01-01,2024-02-01,Pago,PIX,2024-01-01,0,valor,Hipertrofia,Em Andamento,JS001,Cliente VIP
Maria Santos,maria@email.com,Trimestral,2024-01-15,2024-04-15,Pendente,,,50,valor,Adaptação,Em Andamento,MS002,Primeira aluna`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_importacao.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Importar Dados</h1>
        <p className="text-gray-600 mt-1">Importe alunos em massa através de arquivo CSV</p>
      </div>

      {/* Template Download */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-blue-600" />
            Template de Importação
          </CardTitle>
          <CardDescription>
            Baixe o template CSV com as colunas corretas para importar seus dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={downloadTemplate} variant="outline" className="shadow-sm">
            <Download className="h-4 w-4 mr-2" />
            Baixar Template CSV
          </Button>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Instruções:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>O campo "nome" é obrigatório</li>
                  <li>Use o nome exato do plano (Mensal, Trimestral, Semestral, Anual)</li>
                  <li>Formato de data: AAAA-MM-DD (ex: 2024-01-15)</li>
                  <li>Status de pagamento: Pago, Pendente ou Vencido</li>
                  <li>Tipo de desconto: "valor" ou "percentual"</li>
                  <li>Status de treino: Não Iniciado, Em Andamento ou Completado</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileUp className="h-5 w-5 text-orange-600" />
            Upload de Arquivo
          </CardTitle>
          <CardDescription>
            Selecione o arquivo CSV com os dados dos alunos para importar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>

          {file && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-900">
                <span className="font-semibold">Arquivo selecionado:</span> {file?.name}
              </p>
              <p className="text-xs text-green-700 mt-1">
                Tamanho: {(file?.size / 1024)?.toFixed?.(2)} KB
              </p>
            </div>
          )}

          {preview?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Prévia (primeiras 5 linhas):</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      {Object.keys(preview?.[0] ?? {})?.map?.((key) => (
                        <th key={key} className="text-left py-2 px-3 border-b font-semibold">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview?.map?.((row, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        {Object.values(row)?.map?.((value: any, i) => (
                          <td key={i} className="py-2 px-3">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button onClick={handleImport} disabled={!file || loading} className="shadow-md">
              {loading ? 'Importando...' : 'Importar Dados'}
            </Button>
            {file && (
              <Button
                variant="outline"
                onClick={() => {
                  setFile(null);
                  setPreview([]);
                }}
              >
                Limpar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
