import { Request, Response, NextFunction } from 'express';
import { getHomeData, getGallery } from '../services/homeService';

export const getHomeController = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await getHomeData();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getGalleryController = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const images = await getGallery();
    res.json({ images });
  } catch (error) {
    next(error);
  }
};









