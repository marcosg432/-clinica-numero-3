import dotenv from 'dotenv';

// Carregar .env apenas em desenvolvimento local
// Em produção (Railway), as variáveis já vêm do ambiente
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Debug: Log de todas as variáveis de ambiente relacionadas a JWT
console.log('🔍 Debug - Variáveis de ambiente JWT:');
console.log('  - NODE_ENV:', process.env.NODE_ENV);
console.log('  - process.env.JWT_SECRET existe?', !!process.env.JWT_SECRET);
console.log('  - process.env.JWT_SECRET length:', process.env.JWT_SECRET?.length || 0);
console.log('  - process.env.JWT_SECRET value (primeiros 10 chars):', process.env.JWT_SECRET?.substring(0, 10) || 'undefined');
console.log('  - Todas as variáveis de ambiente que começam com JWT:', Object.keys(process.env).filter(key => key.toUpperCase().includes('JWT')));
console.log('  - Todas as variáveis de ambiente disponíveis:', Object.keys(process.env).sort().join(', '));

export const env = {
  port: parseInt(process.env.PORT || process.env.PORT_NUMBER || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
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





