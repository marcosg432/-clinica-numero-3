import { Request, Response, NextFunction } from 'express';
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
} from '../services/appointmentService';

export const createAppointmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const appointment = await createAppointment(req.body);
    res.status(201).json({
      message: 'Agendamento criado com sucesso',
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAppointmentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filters = {
      status: req.query.status as string | undefined,
      page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
    };
    const result = await getAllAppointments(filters);
    // Retornar apenas o array de appointments para o admin panel
    res.json(result.appointments || []);
  } catch (error) {
    next(error);
  }
};

export const getAppointmentByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const appointment = await getAppointmentById(id);
    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

export const confirmAppointmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const appointment = await updateAppointmentStatus(id, 'confirmed');
    res.json({
      message: 'Agendamento confirmado',
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelAppointmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const appointment = await updateAppointmentStatus(id, 'cancelled');
    res.json({
      message: 'Agendamento cancelado',
      appointment,
    });
  } catch (error) {
    next(error);
  }
};








