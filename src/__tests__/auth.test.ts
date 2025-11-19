import request from 'supertest';
import app from '../server';
import prisma from '../config/database';
import * as bcrypt from 'bcryptjs';

describe('Auth API', () => {
  beforeAll(async () => {
    // Criar usuário de teste
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
      where: { email: 'test@test.com' },
      update: {},
      create: {
        name: 'Test User',
        email: 'test@test.com',
        password: hashedPassword,
        role: 'admin',
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: 'test@test.com' },
    });
    await prisma.$disconnect();
  });

  describe('POST /api/admin/login', () => {
    it('deve fazer login com credenciais válidas', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({
          email: 'test@test.com',
          password: 'admin123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@test.com');
    });

    it('deve retornar erro com credenciais inválidas', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({
          email: 'test@test.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('deve validar campos obrigatórios', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({
          email: '',
          password: '',
        });

      expect(response.status).toBe(400);
    });
  });
});









