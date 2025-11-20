import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { swaggerSpec } from './config/swagger';
import swaggerUi from 'swagger-ui-express';
import publicRoutes from './routes/publicRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();

// Middlewares de segurança
app.use(helmet({
  contentSecurityPolicy: env.nodeEnv === 'production' ? undefined : false,
}));
app.use(cors({
  origin: env.nodeEnv === 'production' 
    ? env.cors.origin 
    : true, // Permitir todas as origens em desenvolvimento
  credentials: true,
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Servir arquivos estáticos do frontend (CSS, JS, imagens)
app.use(express.static(path.join(__dirname, '../')));

// Servir página HTML de dashboard
app.use('/dashboard', express.static(path.join(__dirname, '../public')));

// Rota para redirecionar /dashboard para login
app.get('/dashboard', (_req, res) => {
  res.redirect('/dashboard/admin-login.html');
});

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rotas
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Error handler (deve ser o último middleware)
app.use(errorHandler);

// Iniciar servidor
const PORT = env.port;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📚 Documentação Swagger: http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

export default app;



