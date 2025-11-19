import request from 'supertest';
import app from '../server';
import prisma from '../config/database';

describe('Appointment API', () => {
  let treatmentId: string;

  beforeAll(async () => {
    // Criar tratamento de teste
    const treatment = await prisma.treatment.create({
      data: {
        slug: 'test-treatment',
        title: 'Test Treatment',
        description: 'Test description',
        isActive: true,
      },
    });
    treatmentId = treatment.id;
  });

  afterAll(async () => {
    await prisma.appointment.deleteMany({
      where: { email: 'test@test.com' },
    });
    await prisma.treatment.delete({
      where: { id: treatmentId },
    });
    await prisma.$disconnect();
  });

  describe('POST /api/appointments', () => {
    it('deve criar um agendamento válido', async () => {
      const response = await request(app)
        .post('/api/appointments')
        .send({
          name: 'João Silva',
          phone: '+55 67 99999-0000',
          email: 'test@test.com',
          selectedTreatments: [treatmentId],
          datePreferred: '2024-12-25',
          timePreferred: '10:00',
          notes: 'Test notes',
          honeypot: '',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('appointment');
      expect(response.body.appointment.name).toBe('João Silva');
    });

    it('deve validar campos obrigatórios', async () => {
      const response = await request(app)
        .post('/api/appointments')
        .send({
          name: '',
          phone: '',
          email: 'invalid-email',
        });

      expect(response.status).toBe(400);
    });

    it('deve rejeitar honeypot preenchido (anti-bot)', async () => {
      const response = await request(app)
        .post('/api/appointments')
        .send({
          name: 'João Silva',
          phone: '+55 67 99999-0000',
          email: 'test@test.com',
          selectedTreatments: [treatmentId],
          honeypot: 'spam',
        });

      expect(response.status).toBe(400);
    });
  });
});









