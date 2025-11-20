import { Request, Response, NextFunction } from 'express';
import { login } from '../services/authService';

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log('📥 Requisição de login recebida');
    const { email, password } = req.body;
    console.log('📧 Email recebido no controller:', email);
    
    const result = await login({ email, password });
    
    console.log('✅ Login realizado com sucesso para:', email);
    res.json(result);
  } catch (error) {
    console.error('❌ Erro no controller de login:', error);
    next(error);
  }
};









