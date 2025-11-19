import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { optimizeImage } from '../utils/upload';
import { AppError } from '../middleware/errorHandler';

export const uploadImageController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      throw new AppError('Nenhum arquivo enviado', 400);
    }

    const originalPath = req.file.path;
    const ext = path.extname(originalPath);
    const baseName = path.basename(originalPath, ext);
    const optimizedPath = path.join(path.dirname(originalPath), `${baseName}-optimized.jpg`);

    // Otimizar imagem
    await optimizeImage(originalPath, optimizedPath);

    // Retornar URL da imagem
    const imageUrl = `/uploads/${path.basename(optimizedPath)}`;

    res.json({
      message: 'Imagem enviada com sucesso',
      url: imageUrl,
      filename: path.basename(optimizedPath),
    });
  } catch (error) {
    next(error);
  }
};


