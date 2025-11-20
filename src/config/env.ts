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

// Debug: Log de todas as variáveis de ambiente relacionadas a JWT
console.log('🔍 Debug - Variáveis de ambiente JWT:');
console.log('  - NODE_ENV:', process.env.NODE_ENV);
console.log('  - RAILWAY_ENVIRONMENT:', process.env.RAILWAY_ENVIRONMENT);
console.log('  - RAILWAY_PROJECT_ID:', process.env.RAILWAY_PROJECT_ID);
console.log('  - process.env.JWT_SECRET existe?', !!process.env.JWT_SECRET);
console.log('  - process.env.JWT_SECRET length:', process.env.JWT_SECRET?.length || 0);
console.log('  - process.env.JWT_SECRET value (primeiros 10 chars):', process.env.JWT_SECRET?.substring(0, 10) || 'undefined');
console.log('  - Todas as variáveis de ambiente que começam com JWT:', Object.keys(process.env).filter(key => key.toUpperCase().includes('JWT')));
console.log('  - Todas as variáveis de ambiente disponíveis:', Object.keys(process.env).sort().join(', '));

// Tentar ler JWT_SECRET de múltiplas formas
let jwtSecret = process.env.JWT_SECRET 
  || process.env.JWT_SECRET_KEY 
  || process.env.JWT_TOKEN_SECRET
  || process.env.JWTSECRET
  || 'change-me-in-production';

// Verificar se estamos no Railway e se a variável não está configurada
const isRailway = !!process.env.RAILWAY_ENVIRONMENT || !!process.env.RAILWAY_PROJECT_ID || !!process.env.RAILWAY_SERVICE_NAME;
if (isRailway && jwtSecret === 'change-me-in-production') {
  console.error('❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌');
  console.error('❌ JWT_SECRET NÃO ENCONTRADO NO RAILWAY!');
  console.error('❌ Verifique se a variável está configurada como SERVICE VARIABLE');
  console.error('❌ Não como SHARED VARIABLE ou PROJECT VARIABLE');
  console.error('❌ Nome exato: JWT_SECRET (sem espaços, maiúsculas)');
  console.error('❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌');
}

export const env = {
  port: parseInt(process.env.PORT || process.env.PORT_NUMBER || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
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





