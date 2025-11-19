import { body, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((err) => err.msg);
      throw new AppError(errorMessages.join(', '), 400);
    }

    next();
  };
};

export const appointmentValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
    .withMessage('Nome deve conter apenas letras'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Telefone é obrigatório')
    .matches(/^[\d\s\(\)\-\+]+$/)
    .withMessage('Telefone inválido'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email é obrigatório')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('selectedTreatments')
    .isArray({ min: 1 })
    .withMessage('Selecione pelo menos um tratamento'),
  body('datePreferred')
    .optional()
    .isISO8601()
    .withMessage('Data inválida'),
  body('timePreferred')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Horário inválido (use formato HH:MM)'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Observações devem ter no máximo 1000 caracteres'),
  body('honeypot')
    .optional()
    .equals('')
    .withMessage('Bot detectado'),
];

export const treatmentValidation = [
  body('slug')
    .trim()
    .notEmpty()
    .withMessage('Slug é obrigatório')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug deve conter apenas letras minúsculas, números e hífens'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Título é obrigatório')
    .isLength({ min: 3, max: 200 })
    .withMessage('Título deve ter entre 3 e 200 caracteres'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Descrição é obrigatória')
    .isLength({ min: 10, max: 500 })
    .withMessage('Descrição deve ter entre 10 e 500 caracteres'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Preço deve ser um número positivo'),
];

export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email é obrigatório')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter no mínimo 6 caracteres'),
];









