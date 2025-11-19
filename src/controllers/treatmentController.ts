import { Request, Response, NextFunction } from 'express';
import {
  getAllTreatments,
  getTreatmentBySlug,
  getTreatmentById,
  createTreatment,
  updateTreatment,
  deleteTreatment,
} from '../services/treatmentService';

export const getAllTreatmentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const activeOnly = req.query.active === 'true';
    const treatments = await getAllTreatments(activeOnly);
    res.json(treatments);
  } catch (error) {
    next(error);
  }
};

export const getTreatmentBySlugController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    const treatment = await getTreatmentBySlug(slug);
    res.json(treatment);
  } catch (error) {
    next(error);
  }
};

export const getTreatmentByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const treatment = await getTreatmentById(id);
    res.json(treatment);
  } catch (error) {
    next(error);
  }
};

export const createTreatmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const treatment = await createTreatment(req.body);
    res.status(201).json(treatment);
  } catch (error) {
    next(error);
  }
};

export const updateTreatmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const treatment = await updateTreatment(id, req.body);
    res.json(treatment);
  } catch (error) {
    next(error);
  }
};

export const deleteTreatmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await deleteTreatment(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};









