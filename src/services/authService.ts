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
  const { email, password } = credentials;

  // Buscar usuário
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('Email ou senha incorretos', 401);
  }

  // Verificar senha
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Email ou senha incorretos', 401);
  }

  // Gerar token JWT
  if (!env.jwtSecret || env.jwtSecret === 'change-me-in-production') {
    throw new AppError('JWT secret não configurado', 500);
  }

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

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};









