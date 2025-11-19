import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export interface CreateReviewData {
  name: string;
  rating: number;
  comment: string;
  treatmentId?: string;
}

export const getAllReviews = async (approvedOnly: boolean = true) => {
  const where = approvedOnly ? { approved: true } : {};

  return await prisma.review.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      treatment: {
        select: {
          title: true,
          slug: true,
        },
      },
    },
  });
};

export const getPendingReviews = async () => {
  return await prisma.review.findMany({
    where: { approved: false },
    orderBy: { createdAt: 'desc' },
    include: {
      treatment: {
        select: {
          title: true,
          slug: true,
        },
      },
    },
  });
};

export interface UpdateReviewData {
  name?: string;
  rating?: number;
  comment?: string;
  treatmentId?: string;
  approved?: boolean;
}

export const createReview = async (data: CreateReviewData, approved: boolean = true) => {
  // Validar rating
  if (data.rating < 1 || data.rating > 5) {
    throw new AppError('Rating deve ser entre 1 e 5', 400);
  }

  // Se tiver treatmentId, verificar se existe
  if (data.treatmentId) {
    const treatment = await prisma.treatment.findUnique({
      where: { id: data.treatmentId },
    });

    if (!treatment) {
      throw new AppError('Tratamento não encontrado', 404);
    }
  }

  return await prisma.review.create({
    data: {
      name: data.name,
      rating: data.rating,
      comment: data.comment,
      treatmentId: data.treatmentId,
      approved: approved,
    },
  });
};

export const approveReview = async (id: string) => {
  const review = await prisma.review.findUnique({
    where: { id },
  });

  if (!review) {
    throw new AppError('Avaliação não encontrada', 404);
  }

  return await prisma.review.update({
    where: { id },
    data: { approved: true },
  });
};

export const getReviewById = async (id: string) => {
  const review = await prisma.review.findUnique({
    where: { id },
    include: {
      treatment: {
        select: {
          title: true,
          slug: true,
        },
      },
    },
  });

  if (!review) {
    throw new AppError('Avaliação não encontrada', 404);
  }

  return review;
};

export const updateReview = async (id: string, data: UpdateReviewData) => {
  // Verificar se avaliação existe
  await getReviewById(id);

  // Validar rating se fornecido
  if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
    throw new AppError('Rating deve ser entre 1 e 5', 400);
  }

  // Se tiver treatmentId, verificar se existe
  if (data.treatmentId) {
    const treatment = await prisma.treatment.findUnique({
      where: { id: data.treatmentId },
    });

    if (!treatment) {
      throw new AppError('Tratamento não encontrado', 404);
    }
  }

  return await prisma.review.update({
    where: { id },
    data,
  });
};

export const deleteReview = async (id: string) => {
  const review = await prisma.review.findUnique({
    where: { id },
  });

  if (!review) {
    throw new AppError('Avaliação não encontrada', 404);
  }

  return await prisma.review.delete({
    where: { id },
  });
};








