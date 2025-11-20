import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { sendAppointmentEmails } from '../utils/email';

export interface CreateAppointmentData {
  name: string;
  phone: string;
  email: string;
  selectedTreatments: string[];
  datePreferred?: string;
  timePreferred?: string;
  notes?: string;
  honeypot?: string;
}

export const createAppointment = async (data: CreateAppointmentData) => {
  // Verificação anti-bot (honeypot)
  if (data.honeypot && data.honeypot !== '') {
    throw new AppError('Requisição inválida', 400);
  }

  // Validar tratamentos selecionados
  if (data.selectedTreatments.length === 0) {
    throw new AppError('Selecione pelo menos um tratamento', 400);
  }

  // Verificar se os tratamentos existem
  const treatments = await prisma.treatment.findMany({
    where: {
      id: { in: data.selectedTreatments },
      isActive: true,
    },
  });

  if (treatments.length !== data.selectedTreatments.length) {
    throw new AppError('Um ou mais tratamentos selecionados são inválidos', 400);
  }

  // Criar agendamento
  const appointment = await prisma.appointment.create({
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email,
      selectedTreatments: JSON.stringify(data.selectedTreatments),
      datePreferred: data.datePreferred,
      timePreferred: data.timePreferred,
      notes: data.notes,
      status: 'pending',
      treatmentId: data.selectedTreatments[0], // Primeiro tratamento como principal
    },
  });

  // Enviar emails (não bloquear se falhar)
  try {
    await sendAppointmentEmails({
      name: data.name,
      phone: data.phone,
      email: data.email,
      selectedTreatments: treatments.map((t) => t.title),
      datePreferred: data.datePreferred,
      timePreferred: data.timePreferred,
      notes: data.notes,
    });
  } catch (error) {
    console.error('Erro ao enviar emails:', error);
  }

  return appointment;
};

export const getAllAppointments = async (filters?: {
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const skip = (page - 1) * limit;

  const where = filters?.status ? { status: filters.status } : {};

  const [appointments, total] = await Promise.all([
    prisma.appointment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        treatment: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    }),
    prisma.appointment.count({ where }),
  ]);

  // Parsear selectedTreatments de JSON string para array
  const parsedAppointments = appointments.map(appointment => ({
    ...appointment,
    selectedTreatments: appointment.selectedTreatments 
      ? (typeof appointment.selectedTreatments === 'string' 
          ? JSON.parse(appointment.selectedTreatments) 
          : appointment.selectedTreatments)
      : [],
  }));

  return {
    appointments: parsedAppointments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getAppointmentById = async (id: string) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      treatment: true,
    },
  });

  if (!appointment) {
    throw new AppError('Agendamento não encontrado', 404);
  }

  // Parsear selectedTreatments de JSON string para array
  return {
    ...appointment,
    selectedTreatments: appointment.selectedTreatments 
      ? (typeof appointment.selectedTreatments === 'string' 
          ? JSON.parse(appointment.selectedTreatments) 
          : appointment.selectedTreatments)
      : [],
  };
};

export const updateAppointmentStatus = async (
  id: string,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
) => {
  // Verificar se existe (lança erro se não encontrar)
  await getAppointmentById(id);

  return await prisma.appointment.update({
    where: { id },
    data: { status },
  });
};



