import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário admin padrão
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  // Criar admin principal
  const admin = await prisma.user.upsert({
    where: { email: 'admin@clinica.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@clinica.com',
      password: hashedPassword,
      role: 'super_admin',
    },
  });
  console.log('✅ Usuário admin criado:', admin.email);
  
  // Criar admin alternativo (para compatibilidade)
  const adminAlt = await prisma.user.upsert({
    where: { email: 'admin@odontoazul.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@odontoazul.com',
      password: hashedPassword,
      role: 'super_admin',
    },
  });
  console.log('✅ Usuário admin alternativo criado:', adminAlt.email);

  // Criar informações da clínica (apenas se não existir)
  const existingClinicInfo = await prisma.clinicInfo.findFirst();
  if (!existingClinicInfo) {
    await prisma.clinicInfo.create({
      data: {
        address: 'Av. Afonso Pena, 4909 – Campo Grande/MS',
        phone: '+55 67 99999-0000',
        email: 'contato@odontoazul.com',
        whatsapp: '+5567999990000',
        instagram: '@odontoazul',
        facebook: 'odontoazul',
        workingHours: 'Segunda a Sexta: 8h às 18h\nSábado: 8h às 12h',
      },
    });
    console.log('✅ Informações da clínica criadas');
  } else {
    console.log('ℹ️  Informações da clínica já existem');
  }

  // Criar tratamentos de exemplo
  const treatments = [
    {
      slug: 'ortodontia-digital',
      title: 'Ortodontia Digital',
      description: 'Planejamento 3D e alinhadores transparentes para conforto e previsibilidade.',
      fullDescription: 'A ortodontia digital revoluciona o tratamento ortodôntico com tecnologia de ponta. Utilizamos scanners intraorais 3D para criar modelos precisos dos seus dentes, permitindo planejamento virtual completo antes mesmo de iniciar o tratamento. Nossos alinhadores transparentes são fabricados com tecnologia de última geração, oferecendo máximo conforto e resultados previsíveis.',
      price: 3500.00,
      gallery: JSON.stringify([]),
      benefits: JSON.stringify([
        'Alinhadores transparentes e removíveis',
        'Planejamento 3D completo',
        'Menos visitas ao consultório',
        'Higiene facilitada',
        'Resultados previsíveis'
      ]),
      observations: 'Tratamento indicado para adultos e adolescentes. Duração média de 12 a 24 meses.',
      isActive: true,
    },
    {
      slug: 'estetica-avancada',
      title: 'Estética Avançada',
      description: 'Clareamento guiado, lentes e design de sorriso com mock-up digital.',
      fullDescription: 'Transforme seu sorriso com nossos tratamentos estéticos avançados. Oferecemos clareamento dental com tecnologia LED, lentes de contato dental personalizadas e design de sorriso digital. Antes de iniciar qualquer procedimento, criamos um mock-up digital para você visualizar o resultado final.',
      price: 2800.00,
      gallery: JSON.stringify([]),
      benefits: JSON.stringify([
        'Clareamento dental profissional',
        'Lentes de contato dental',
        'Design de sorriso digital',
        'Mock-up prévio',
        'Resultados naturais'
      ]),
      observations: 'Sessões de clareamento podem variar de 1 a 3 consultas. Lentes de contato requerem preparo mínimo dos dentes.',
      isActive: true,
    },
    {
      slug: 'implantodontia-guiada',
      title: 'Implantodontia Guiada',
      description: 'Cirurgia guiada por tomografia para reabilitações precisas e rápidas.',
      fullDescription: 'Implantes dentários com precisão cirúrgica através de tecnologia guiada por tomografia computadorizada. Planejamos cada implante virtualmente antes da cirurgia, garantindo máxima precisão, menor tempo de procedimento e recuperação mais rápida.',
      price: 4500.00,
      gallery: JSON.stringify([]),
      benefits: JSON.stringify([
        'Cirurgia guiada por tomografia',
        'Precisão milimétrica',
        'Menor tempo cirúrgico',
        'Recuperação mais rápida',
        'Taxa de sucesso superior a 98%'
      ]),
      observations: 'Procedimento realizado com anestesia local. Período de osseointegração de 3 a 6 meses.',
      isActive: true,
    },
    {
      slug: 'odontopediatria',
      title: 'Odontopediatria',
      description: 'Atendimento lúdico com foco em prevenção e acolhimento familiar.',
      fullDescription: 'Cuidados odontológicos especializados para crianças e adolescentes. Nosso ambiente foi pensado para acolher os pequenos pacientes com carinho e tranquilidade. Focamos em prevenção, educação e tratamento precoce, sempre com abordagem lúdica e humanizada.',
      price: 150.00,
      gallery: JSON.stringify([]),
      benefits: JSON.stringify([
        'Ambiente lúdico e acolhedor',
        'Foco em prevenção',
        'Educação em saúde bucal',
        'Tratamento precoce',
        'Acompanhamento familiar'
      ]),
      observations: 'Recomendamos a primeira consulta a partir dos 6 meses de idade. Consultas preventivas a cada 6 meses.',
      isActive: true,
    },
  ];

  for (const treatment of treatments) {
    await prisma.treatment.upsert({
      where: { slug: treatment.slug },
      update: {},
      create: treatment,
    });
  }
  console.log(`✅ ${treatments.length} tratamentos criados`);

  // Criar avaliações de exemplo (algumas aprovadas para o site, algumas pendentes para o admin)
  const reviews = [
    {
      name: 'Maria Silva',
      rating: 5,
      comment: 'Excelente atendimento! A equipe é muito profissional e o ambiente é acolhedor. Recomendo!',
      approved: true, // Aprovada - aparece no site
    },
    {
      name: 'João Santos',
      rating: 5,
      comment: 'Tratamento de ortodontia digital superou minhas expectativas. Alinhadores muito confortáveis.',
      approved: true, // Aprovada - aparece no site
    },
    {
      name: 'Ana Costa',
      rating: 5,
      comment: 'Fiz clareamento e o resultado foi incrível! Profissionais de primeira linha.',
      approved: true, // Aprovada - aparece no site
    },
    {
      name: 'Carlos Oliveira',
      rating: 5,
      comment: 'Atendimento excelente! A clínica tem uma estrutura moderna e os profissionais são muito atenciosos.',
      approved: false, // Pendente - aparece no painel admin
    },
    {
      name: 'Juliana Ferreira',
      rating: 4,
      comment: 'Gostei muito do tratamento. Recomendo a clínica para todos!',
      approved: false, // Pendente - aparece no painel admin
    },
  ];

  for (const review of reviews) {
    await prisma.review.create({
      data: review,
    });
  }
  console.log(`✅ ${reviews.length} avaliações criadas`);

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


