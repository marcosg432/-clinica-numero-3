import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Tentar carregar variáveis de ambiente de múltiplas formas
dotenv.config(); // Tenta carregar .env se existir

// Em produção (Railway), tentar carregar de .env.production se existir
if (process.env.NODE_ENV === 'production' || !process.env.NODE_ENV) {
  const envProductionPath = path.join(process.cwd(), '.env.production');
  if (fs.existsSync(envProductionPath)) {
    dotenv.config({ path: envProductionPath });
  }
}

// Debug: Log de todas as variáveis de ambiente relacionadas a JWT e DATABASE
console.log('🔍 Debug - Variáveis de ambiente:');
console.log('  - NODE_ENV:', process.env.NODE_ENV);
console.log('  - RAILWAY_ENVIRONMENT:', process.env.RAILWAY_ENVIRONMENT);
console.log('  - RAILWAY_PROJECT_ID:', process.env.RAILWAY_PROJECT_ID);
console.log('  - process.env.JWT_SECRET existe?', !!process.env.JWT_SECRET);
console.log('  - process.env.JWT_SECRET length:', process.env.JWT_SECRET?.length || 0);
console.log('  - process.env.JWT_SECRET value (primeiros 10 chars):', process.env.JWT_SECRET?.substring(0, 10) || 'undefined');
console.log('  - process.env.DATABASE_URL existe?', !!process.env.DATABASE_URL);
console.log('  - process.env.DATABASE_URL value:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 30) + '...' : 'UNDEFINED');
console.log('  - Todas as variáveis de ambiente que começam com JWT:', Object.keys(process.env).filter(key => key.toUpperCase().includes('JWT')));
console.log('  - Todas as variáveis de ambiente que começam com DATABASE:', Object.keys(process.env).filter(key => key.toUpperCase().includes('DATABASE')));

// Tentar ler JWT_SECRET de múltiplas formas
let jwtSecret = process.env.JWT_SECRET 
  || process.env.JWT_SECRET_KEY 
  || process.env.JWT_TOKEN_SECRET
  || process.env.JWTSECRET
  || null;

// Verificar se estamos no Railway
const isRailway = !!process.env.RAILWAY_ENVIRONMENT 
  || !!process.env.RAILWAY_PROJECT_ID 
  || !!process.env.RAILWAY_SERVICE_NAME
  || process.env.RAILWAY === 'true';

// Se JWT_SECRET não foi encontrado
if (!jwtSecret) {
  if (isRailway) {
    console.error('❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌');
    console.error('❌ JWT_SECRET NÃO ENCONTRADO NO RAILWAY!');
    console.error('❌ Verifique se a variável está configurada como SERVICE VARIABLE');
    console.error('❌ Não como SHARED VARIABLE ou PROJECT VARIABLE');
    console.error('❌ Nome exato: JWT_SECRET (sem espaços, maiúsculas)');
    console.error('❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌');
    console.warn('⚠️ Usando valor temporário apenas para permitir o sistema funcionar.');
    console.warn('⚠️ ISSO É TEMPORÁRIO - CONFIGURE JWT_SECRET CORRETAMENTE NO RAILWAY!');
    // Valor temporário fixo para permitir o sistema funcionar
    // IMPORTANTE: Este valor será usado apenas se JWT_SECRET não estiver configurado
    jwtSecret = 'temp-jwt-secret-railway-fix-0d4ad7ab4ae8e38f7be9bc38bb6d1a2d36e31d0ff55c46bc088296afc6124725';
  } else {
    // Em desenvolvimento local, usar valor padrão
    jwtSecret = 'change-me-in-production';
  }
}

// Tentar ler DATABASE_URL de múltiplas formas
let databaseUrl = process.env.DATABASE_URL || null;

// Se não encontrado e estamos no Railway, usar valor padrão para SQLite
if (!databaseUrl) {
  if (isRailway) {
    console.error('❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌');
    console.error('❌ DATABASE_URL NÃO ENCONTRADO NO RAILWAY!');
    console.error('❌ Adicione a variável DATABASE_URL no Railway:');
    console.error('❌ Nome: DATABASE_URL');
    console.error('❌ Valor: file:./prisma/database.db');
    console.error('❌ Tipo: SERVICE VARIABLE (não Shared ou Project)');
    console.error('❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌');
    // Valor padrão para SQLite no Railway
    databaseUrl = 'file:./prisma/database.db';
    console.warn('⚠️ Usando valor padrão temporário:', databaseUrl);
    console.warn('⚠️ CONFIGURE DATABASE_URL CORRETAMENTE NO RAILWAY!');
  } else {
    // Em desenvolvimento local, usar valor padrão
    databaseUrl = 'file:./prisma/database.db';
  }
}

export const env = {
  port: parseInt(process.env.PORT || process.env.PORT_NUMBER || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: databaseUrl,
  jwtSecret: jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
    from: process.env.EMAIL_FROM || 'Clínica Odonto Azul <noreply@odontoazul.com>',
  },
  upload: {
    dir: process.env.UPLOAD_DIR || './uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
  },
  cors: {
    origin: process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
      : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutos
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
};





