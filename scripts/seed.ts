import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create test user
  const hashedPassword = await bcrypt.hash('johndoe123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      password: hashedPassword,
      name: 'John Doe',
    },
  });
  console.log('User created:', user.email);

  // Create default plan types
  const planTypes = [
    { name: 'Mensal', color: '#3B82F6', order: 1 },
    { name: 'Trimestral', color: '#10B981', order: 2 },
    { name: 'Semestral', color: '#F59E0B', order: 3 },
    { name: 'Anual', color: '#8B5CF6', order: 4 },
  ];

  for (const plan of planTypes) {
    await prisma.planType.upsert({
      where: { name: plan.name },
      update: {},
      create: plan,
    });
  }
  console.log('Plan types created');

  // Create default training phases
  const trainingPhases = [
    { name: 'Adaptação', color: '#06B6D4', order: 1 },
    { name: 'Hipertrofia', color: '#F97316', order: 2 },
    { name: 'Definição', color: '#EC4899', order: 3 },
  ];

  for (const phase of trainingPhases) {
    await prisma.trainingPhase.upsert({
      where: { name: phase.name },
      update: {},
      create: phase,
    });
  }
  console.log('Training phases created');

  // Get created plan types and phases for students
  const mensal = await prisma.planType.findUnique({ where: { name: 'Mensal' } });
  const trimestral = await prisma.planType.findUnique({ where: { name: 'Trimestral' } });
  const semestral = await prisma.planType.findUnique({ where: { name: 'Semestral' } });
  const anual = await prisma.planType.findUnique({ where: { name: 'Anual' } });
  
  const adaptacao = await prisma.trainingPhase.findUnique({ where: { name: 'Adaptação' } });
  const hipertrofia = await prisma.trainingPhase.findUnique({ where: { name: 'Hipertrofia' } });
  const definicao = await prisma.trainingPhase.findUnique({ where: { name: 'Definição' } });

  // Create sample students
  const students = [
    {
      name: 'Maria Silva',
      email: 'maria.silva@email.com',
      planTypeId: mensal?.id || '',
      planStartDate: new Date('2024-11-01'),
      planExpiryDate: new Date('2024-12-01'),
      trainingStartDate: new Date('2024-11-05'),
      trainingExpiryDate: new Date('2024-11-20'),
      trainingPhaseId: adaptacao?.id,
      trainingStatus: 'Em Andamento',
      paymentStatus: 'Pago',
      paymentMethod: 'PIX',
      paymentDate: new Date('2024-11-01'),
      discount: 0,
      trainingAccessId: 'MS001',
      observations: 'Primeira aluna da consultoria',
    },
    {
      name: 'João Santos',
      email: 'joao.santos@email.com',
      planTypeId: trimestral?.id || '',
      planStartDate: new Date('2024-10-01'),
      planExpiryDate: new Date('2025-01-01'),
      trainingStartDate: new Date('2024-10-05'),
      trainingExpiryDate: new Date('2024-12-05'),
      trainingPhaseId: hipertrofia?.id,
      trainingStatus: 'Em Andamento',
      paymentStatus: 'Pago',
      paymentMethod: 'Cartão de Crédito',
      paymentDate: new Date('2024-10-01'),
      discount: 50,
      discountType: 'valor',
      trainingAccessId: 'JS002',
      observations: 'Cliente VIP - desconto especial',
    },
    {
      name: 'Ana Costa',
      email: 'ana.costa@email.com',
      planTypeId: semestral?.id || '',
      planStartDate: new Date('2024-09-01'),
      planExpiryDate: new Date('2025-03-01'),
      trainingStartDate: new Date('2024-09-10'),
      trainingExpiryDate: new Date('2025-02-10'),
      trainingPhaseId: definicao?.id,
      trainingStatus: 'Em Andamento',
      paymentStatus: 'Pago',
      paymentMethod: 'Boleto Bancário',
      paymentDate: new Date('2024-09-01'),
      discount: 10,
      discountType: 'percentual',
      trainingAccessId: 'AC003',
      observations: 'Objetivo: perder 10kg',
    },
    {
      name: 'Carlos Oliveira',
      email: 'carlos.oliveira@email.com',
      planTypeId: anual?.id || '',
      planStartDate: new Date('2024-06-01'),
      planExpiryDate: new Date('2025-06-01'),
      trainingStartDate: new Date('2024-06-15'),
      trainingExpiryDate: new Date('2025-05-15'),
      trainingPhaseId: hipertrofia?.id,
      trainingStatus: 'Em Andamento',
      paymentStatus: 'Pago',
      paymentMethod: 'PIX',
      paymentDate: new Date('2024-06-01'),
      discount: 15,
      discountType: 'percentual',
      trainingAccessId: 'CO004',
      observations: 'Atleta profissional',
    },
    {
      name: 'Fernanda Lima',
      email: 'fernanda.lima@email.com',
      planTypeId: mensal?.id || '',
      planStartDate: new Date('2024-11-15'),
      planExpiryDate: new Date('2024-12-15'),
      trainingStartDate: null,
      trainingExpiryDate: null,
      trainingPhaseId: null,
      trainingStatus: 'Não Iniciado',
      paymentStatus: 'Pendente',
      paymentMethod: null,
      paymentDate: null,
      discount: 0,
      trainingAccessId: 'FL005',
      observations: 'Aguardando pagamento',
    },
    {
      name: 'Ricardo Mendes',
      email: 'ricardo.mendes@email.com',
      planTypeId: trimestral?.id || '',
      planStartDate: new Date('2024-08-01'),
      planExpiryDate: new Date('2024-11-01'),
      trainingStartDate: new Date('2024-08-10'),
      trainingExpiryDate: new Date('2024-10-25'),
      trainingPhaseId: definicao?.id,
      trainingStatus: 'Completado',
      paymentStatus: 'Pago',
      paymentMethod: 'Cartão de Crédito',
      paymentDate: new Date('2024-08-01'),
      discount: 0,
      trainingAccessId: 'RM006',
      observations: 'Concluiu treino com sucesso',
    },
    {
      name: 'Beatriz Almeida',
      email: 'beatriz.almeida@email.com',
      planTypeId: mensal?.id || '',
      planStartDate: new Date('2024-10-20'),
      planExpiryDate: new Date('2024-11-20'),
      trainingStartDate: new Date('2024-10-25'),
      trainingExpiryDate: new Date('2024-11-15'),
      trainingPhaseId: adaptacao?.id,
      trainingStatus: 'Em Andamento',
      paymentStatus: 'Vencido',
      paymentMethod: 'Boleto Bancário',
      paymentDate: null,
      discount: 0,
      trainingAccessId: 'BA007',
      observations: 'Pagamento em atraso - entrar em contato',
    },
    {
      name: 'Paulo Rodrigues',
      email: 'paulo.rodrigues@email.com',
      planTypeId: semestral?.id || '',
      planStartDate: new Date('2024-11-10'),
      planExpiryDate: new Date('2025-05-10'),
      trainingStartDate: new Date('2024-11-12'),
      trainingExpiryDate: new Date('2025-04-30'),
      trainingPhaseId: hipertrofia?.id,
      trainingStatus: 'Em Andamento',
      paymentStatus: 'Pago',
      paymentMethod: 'PIX',
      paymentDate: new Date('2024-11-10'),
      discount: 100,
      discountType: 'valor',
      trainingAccessId: 'PR008',
      observations: 'Promoção Black Friday',
    },
  ];

  for (const student of students) {
    await prisma.student.create({
      data: student,
    });
  }
  console.log('Sample students created');

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
