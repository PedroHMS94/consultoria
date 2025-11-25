export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value ?? 0);
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '-';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR').format(dateObj);
}

export function getDaysUntilExpiry(expiryDate: Date | string): number {
  const expiry = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate;
  const now = new Date();
  const diff = expiry.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getExpiryStatusColor(days: number): string {
  if (days <= 0) return 'red';
  if (days <= 7) return 'red';
  if (days <= 15) return 'yellow';
  if (days <= 30) return 'orange';
  return 'green';
}

export function getExpiryStatusVariant(
  days: number
): 'default' | 'success' | 'warning' | 'danger' {
  if (days <= 0) return 'danger';
  if (days <= 7) return 'danger';
  if (days <= 15) return 'warning';
  if (days <= 30) return 'warning';
  return 'success';
}

export function getPaymentStatusVariant(
  status: string
): 'default' | 'success' | 'warning' | 'danger' {
  if (status === 'Pago') return 'success';
  if (status === 'Pendente') return 'warning';
  if (status === 'Vencido') return 'danger';
  return 'default';
}

export function getTrainingStatusVariant(
  status: string
): 'default' | 'success' | 'warning' | 'info' {
  if (status === 'Completado') return 'success';
  if (status === 'Em Andamento') return 'info';
  if (status === 'Não Iniciado') return 'warning';
  return 'default';
}
