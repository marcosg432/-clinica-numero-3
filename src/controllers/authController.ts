import { Request, Response, NextFunction } from 'express';
import { login } from '../services/authService';

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await login({ email, password });

    res.json(result);
  } catch (error) {
    next(error);
  }
};









