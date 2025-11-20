// Nota: Inicialização do banco de dados será feita via script separado
// ou manualmente via shell do Railway após o primeiro deploy

// ⚠️ CRÍTICO: Definir DATABASE_URL ANTES de qualquer importação do Prisma
// O Prisma Client valida DATABASE_URL no momento da importação
if (!process.env.DATABASE_URL) {
  const isRailway = !!process.env.RAILWAY_ENVIRONMENT 
    || !!process.env.RAILWAY_PROJECT_ID 
    || !!process.env.RAILWAY_SERVICE_NAME;
  
  if (isRailway) {
    console.warn('⚠️ DATABASE_URL não encontrada. Usando valor padrão para SQLite.');
    console.warn('⚠️ Configure DATABASE_URL no Railway: file:./prisma/database.db');
  }
  // Definir valor padrão para SQLite
  process.env.DATABASE_URL = 'file:./prisma/database.db';
}

// LOG DEBUG IMEDIATO - ANTES DE QUALQUER IMPORTAÇÃO
console.log('═══════════════════════════════════════════════════════');
console.log('🚀 SERVIDOR INICIANDO - DEBUG DE VARIÁVEIS DE AMBIENTE');
console.log('═══════════════════════════════════════════════════════');
console.log('📋 NODE_ENV:', process.env.NODE_ENV);
console.log('📋 PORT:', process.env.PORT);
console.log('📋 JWT_SECRET existe?', !!process.env.JWT_SECRET);
console.log('📋 JWT_SECRET length:', process.env.JWT_SECRET?.length || 0);
console.log('📋 JWT_SECRET valor:', process.env.JWT_SECRET ? process.env.JWT_SECRET.substring(0, 20) + '...' : 'UNDEFINED');
console.log('📋 DATABASE_URL existe?', !!process.env.DATABASE_URL);
console.log('📋 DATABASE_URL valor:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 50) + '...' : 'UNDEFINED');
console.log('📋 Total de variáveis de ambiente:', Object.keys(process.env).length);
console.log('📋 TODAS as variáveis:', JSON.stringify(Object.keys(process.env).sort(), null, 2));
console.log('═══════════════════════════════════════════════════════');

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
import prisma from './config/database';

// Tratamento de erros não capturados
process.on('uncaughtException', (error: Error) => {
  console.error('❌ Erro não capturado:', error);
  // Não encerrar o processo imediatamente para permitir que o health check funcione
});

process.on('unhandledRejection', (reason: unknown) => {
  console.error('❌ Promise rejeitada não tratada:', reason);
});

const app = express();

// Configurar trust proxy para funcionar corretamente no Railway
app.set('trust proxy', true);

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

// Endpoint de debug para verificar variáveis de ambiente
app.get('/debug/env', (_req, res) => {
  const envVars = Object.keys(process.env).sort();
  const isRailway = !!process.env.RAILWAY_ENVIRONMENT 
    || !!process.env.RAILWAY_PROJECT_ID 
    || !!process.env.RAILWAY_SERVICE_NAME;
  
  const envData: Record<string, any> = {
    total: envVars.length,
    isRailway: isRailway,
    hasJWT_SECRET: !!process.env.JWT_SECRET,
    hasDATABASE_URL: !!process.env.DATABASE_URL,
    JWT_SECRET_length: process.env.JWT_SECRET?.length || 0,
    DATABASE_URL_length: process.env.DATABASE_URL?.length || 0,
    JWT_SECRET_preview: process.env.JWT_SECRET ? process.env.JWT_SECRET.substring(0, 10) + '...' : 'UNDEFINED',
    env_jwtSecret_length: env.jwtSecret?.length || 0,
    env_jwtSecret_preview: env.jwtSecret ? env.jwtSecret.substring(0, 20) + '...' : 'UNDEFINED',
    allVars: envVars,
    railwayVars: envVars.filter(v => v.toUpperCase().includes('RAILWAY')),
  };
  res.json(envData);
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

// Servir página HTML de dashboard - deve vir ANTES das rotas da API
app.use('/dashboard', express.static(path.join(__dirname, '../public'), {
  index: 'admin-login.html',
  extensions: ['html']
}));

// Rota para redirecionar /dashboard para login
app.get('/dashboard', (_req, res) => {
  res.redirect('/dashboard/admin-login.html');
});

// Rota específica para admin-login.html
app.get('/dashboard/admin-login.html', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin-login.html'));
});

// Rota específica para admin.html
app.get('/dashboard/admin.html', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin.html'));
});

// Rotas da API - devem vir ANTES do handler 404
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404 handler - deve ser o último middleware, ANTES do error handler
app.use((_req, res) => {
  // Se a requisição é para um arquivo HTML ou começa com /dashboard, tenta servir o arquivo
  if (_req.path.startsWith('/dashboard') || _req.path.endsWith('.html')) {
    res.status(404).send('Página não encontrada');
    return;
  }
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Error handler (deve ser o último middleware)
app.use(errorHandler);

// Função para verificar e popular o banco se estiver vazio
async function checkAndSeedDatabase() {
  try {
    console.log('🔍 Verificando estado do banco de dados...');
    
    // Verificar se consegue conectar ao banco
    await prisma.$connect();
    console.log('✅ Conexão com banco de dados estabelecida');
    
    // Verificar se há usuários no banco
    const userCount = await prisma.user.count();
    console.log(`👤 Usuários no banco: ${userCount}`);
    
    // Verificar se há tratamentos no banco
    const treatmentCount = await prisma.treatment.count();
    console.log(`💊 Tratamentos no banco: ${treatmentCount}`);
    
    // Se não há usuários ou tratamentos, popular o banco
    if (userCount === 0 || treatmentCount === 0) {
      console.log('🌱 Banco de dados vazio ou incompleto detectado. Populando...');
      
      // Importar e executar o seed diretamente
      try {
        const { execSync } = require('child_process');
        const path = require('path');
        
        // Tentar executar o seed compilado (mais confiável no Railway)
        const seedPath = path.join(__dirname, '../prisma/seed.ts');
        console.log('📝 Executando seed de:', seedPath);
        
        // Executar usando npx tsx ou node (o que estiver disponível)
        try {
          execSync('npx tsx prisma/seed.ts', {
            stdio: 'inherit',
            env: { ...process.env },
            cwd: process.cwd(),
            shell: true
          });
          console.log('✅ Banco de dados populado com sucesso via tsx!');
        } catch (tsxError) {
          console.log('⚠️ tsx não disponível, tentando node...');
          // Se tsx falhar, tenta usar node diretamente (se o seed estiver compilado)
          throw tsxError; // Por enquanto, apenas relança o erro
        }
      } catch (seedError: any) {
        console.error('⚠️ Erro ao executar seed automático:', seedError.message);
        console.log('💡 Você pode popular o banco via painel admin ou executar manualmente no Railway shell:');
        console.log('   npx tsx prisma/seed.ts');
        console.log('💡 Ou use a rota POST /api/admin/seed (após fazer login)');
      }
    } else {
      console.log(`✅ Banco de dados já possui ${userCount} usuário(s) e ${treatmentCount} tratamento(s).`);
    }
  } catch (error: any) {
    console.error('⚠️ Erro ao verificar banco de dados:', error.message);
    console.log('💡 Verifique se as migrations foram executadas no Railway.');
    console.log('💡 O servidor continuará iniciando normalmente.');
    console.log('💡 Você pode executar manualmente: npx prisma migrate deploy');
  }
}

// Verificar e popular banco de dados em background (não bloqueia o servidor)
checkAndSeedDatabase().catch(() => {
  // Ignorar erros silenciosamente para não bloquear o servidor
});

// Iniciar servidor
const PORT = env.port;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌐 Host: ${HOST}`);
  console.log(`🔑 process.env.JWT_SECRET: ${process.env.JWT_SECRET ? 'PRESENTE' : 'AUSENTE'}`);
  console.log(`🔑 process.env.JWT_SECRET length: ${process.env.JWT_SECRET?.length || 0}`);
  console.log(`🔑 env.jwtSecret configurado: ${env.jwtSecret ? 'SIM' : 'NÃO'}`);
  console.log(`🔑 env.jwtSecret length: ${env.jwtSecret?.length || 0}`);
  console.log(`🔑 env.jwtSecret é default: ${env.jwtSecret === 'change-me-in-production' ? 'SIM' : 'NÃO'}`);
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



