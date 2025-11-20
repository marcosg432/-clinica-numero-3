import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { env } from '../config/env';
import { AppError } from '../middleware/errorHandler';

// Criar diretório de uploads se não existir
const uploadDir = env.upload.dir;
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `img-${uniqueSuffix}${ext}`);
  },
});

// Filtro de tipos de arquivo
const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Tipo de arquivo não permitido. Use JPG, PNG ou WEBP.', 400));
  }
};

// Configuração do multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.upload.maxFileSize,
  },
});

// Otimizar imagem
export const optimizeImage = async (
  inputPath: string,
  outputPath: string,
  width: number = 1200,
  quality: number = 85
): Promise<void> => {
  try {
    await sharp(inputPath)
      .resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside',
      })
      .jpeg({ quality })
      .toFile(outputPath);

    // Remover arquivo original
    fs.unlinkSync(inputPath);
  } catch (error) {
    throw new AppError('Erro ao processar imagem', 500);
  }
};

// Gerar thumbnail
export const generateThumbnail = async (
  inputPath: string,
  outputPath: string,
  size: number = 300
): Promise<void> => {
  try {
    await sharp(inputPath)
      .resize(size, size, {
        fit: 'cover',
      })
      .jpeg({ quality: 80 })
      .toFile(outputPath);
  } catch (error) {
    throw new AppError('Erro ao gerar thumbnail', 500);
  }
};









