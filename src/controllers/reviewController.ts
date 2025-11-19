import { Request, Response, NextFunction } from 'express';
import {
  getAllReviews,
  getPendingReviews,
  getReviewById,
  createReview,
  updateReview,
  approveReview,
  deleteReview,
} from '../services/reviewService';

export const getAllReviewsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Se passar approved=false, buscar todas (aprovadas e não aprovadas)
    // Caso contrário, buscar apenas aprovadas
    const approvedOnly = req.query.approved !== 'false';
    const reviews = await getAllReviews(approvedOnly);
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

export const getPendingReviewsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reviews = await getPendingReviews();
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

export const getReviewByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const review = await getReviewById(id);
    res.json(review);
  } catch (error) {
    next(error);
  }
};

export const createReviewController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Se for do admin, criar como aprovada automaticamente
    const approved = req.body.approved !== undefined ? req.body.approved : true;
    const review = await createReview(req.body, approved);
    res.status(201).json({
      message: 'Avaliação criada com sucesso.',
      review,
    });
  } catch (error) {
    next(error);
  }
};

export const updateReviewController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const review = await updateReview(id, req.body);
    res.json({
      message: 'Avaliação atualizada com sucesso',
      review,
    });
  } catch (error) {
    next(error);
  }
};

export const approveReviewController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const review = await approveReview(id);
    res.json({
      message: 'Avaliação aprovada',
      review,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReviewController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await deleteReview(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};








