// Nota: Inicialização do banco de dados será feita via script separado
// ou manualmente via shell do Railway após o primeiro deploy

import express from 'express';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import path from 'path';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { swaggerSpec } from './config/swagger';
import swaggerUi from 'swagger-ui-express';
import publicRoutes from './routes/publicRoutes';
import adminRoutes from './routes/adminRoutes';

// Tratamento de erros não capturados
process.on('uncaughtException', (error: Error) => {
  console.error('❌ Erro não capturado:', error);
  // Não encerrar o processo imediatamente para permitir que o health check funcione
});

process.on('unhandledRejection', (reason: unknown) => {
  console.error('❌ Promise rejeitada não tratada:', reason);
});

const app = express();

// Health check - PRIMEIRO, antes de qualquer middleware
// Deve ser acessível mesmo se outros middlewares falharem
// SEM dependências de qualquer tipo
app.get('/health', (_req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    env: process.env.NODE_ENV || 'unknown'
  });
});

// Health check alternativo - root path também funciona como health check
app.get('/', (_req, res) => {
  res.status(200).json({ 
    status: 'ok',
    message: 'Clínica Odonto Azul API',
    health: '/health'
  });
});

// Middlewares de segurança
app.use(helmet({
  contentSecurityPolicy: env.nodeEnv === 'production' ? undefined : false,
}));

// Configurar CORS para aceitar URLs do Vercel e da lista configurada
const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void): void => {
    // Permitir requisições sem origem (mobile apps, curl, etc.)
    if (!origin) {
      callback(null, true);
      return;
    }

    // Permitir todas as origens em desenvolvimento
    if (env.nodeEnv !== 'production') {
      callback(null, true);
      return;
    }

    console.log('🌐 CORS - Origem recebida:', origin);

    // Permitir URLs do Vercel (*.vercel.app)
    if (origin.endsWith('.vercel.app')) {
      console.log('✅ CORS - Permitido (Vercel):', origin);
      callback(null, true);
      return;
    }

    // Verificar se está na lista configurada
    if (env.cors.origin.includes(origin)) {
      console.log('✅ CORS - Permitido (Lista):', origin);
      callback(null, true);
      return;
    }

    console.log('❌ CORS - Bloqueado:', origin);
    console.log('📋 CORS - Origens permitidas:', env.cors.origin);
    callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

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
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌐 Host: ${HOST}`);
  console.log(`📚 Documentação Swagger: http://${HOST}:${PORT}/api-docs`);
  console.log(`🏥 Health check: http://${HOST}:${PORT}/health`);
  console.log(`✅ Servidor pronto para receber requisições`);
  
  // Log adicional para confirmar que está escutando
  server.on('listening', () => {
    console.log(`✅ Servidor escutando em ${HOST}:${PORT}`);
  });
});

// Tratamento de erros do servidor
server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requer privilégios elevados`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} já está em uso`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

export default app;



