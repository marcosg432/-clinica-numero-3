import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import prisma from '../config/database';
import { env } from '../config/env';
import { AppError } from '../middleware/errorHandler';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    console.log('🔐 Iniciando processo de login...');
    console.log('🔑 JWT_SECRET verificação:', {
      hasValue: !!env.jwtSecret,
      length: env.jwtSecret?.length || 0,
      isDefault: env.jwtSecret === 'change-me-in-production',
      firstChars: env.jwtSecret?.substring(0, 8) || 'undefined'
    });
    const { email, password } = credentials;
    console.log('📧 Email recebido:', email);

    // Verificar JWT secret
    if (!env.jwtSecret) {
      console.error('❌ JWT_SECRET não configurado');
      console.error('❌ Variáveis de ambiente:', {
        JWT_SECRET: process.env.JWT_SECRET ? 'presente' : 'ausente',
        JWT_SECRET_length: process.env.JWT_SECRET?.length || 0
      });
      throw new AppError('JWT secret não configurado', 500);
    }

    // Avisar se estiver usando valor temporário (mas permitir funcionar)
    if (env.jwtSecret.startsWith('temp-jwt-secret-railway-fix-')) {
      console.warn('⚠️ ATENÇÃO: Usando valor temporário de JWT_SECRET!');
      console.warn('⚠️ Configure JWT_SECRET corretamente no Railway.');
    }

    // Buscar usuário
    console.log('🔍 Buscando usuário no banco de dados...');
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log('❌ Usuário não encontrado:', email);
      throw new AppError('Email ou senha incorretos', 401);
    }

    console.log('✅ Usuário encontrado:', user.email);

    // Verificar senha
    console.log('🔒 Verificando senha...');
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('❌ Senha incorreta para usuário:', email);
      throw new AppError('Email ou senha incorretos', 401);
    }

    console.log('✅ Senha correta');

    // Gerar token JWT
    console.log('🎫 Gerando token JWT...');
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(
      payload,
      env.jwtSecret,
      {
        expiresIn: env.jwtExpiresIn,
      } as SignOptions
    );

    console.log('✅ Token gerado com sucesso');

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    console.error('❌ Erro no login:', error);
    // Se já é um AppError, re-lança
    if (error instanceof AppError) {
      throw error;
    }
    // Se é um erro do Prisma ou outro erro inesperado, lança como erro interno
    console.error('❌ Erro inesperado no login:', error);
    throw new AppError('Erro interno do servidor durante o login', 500);
  }
};









