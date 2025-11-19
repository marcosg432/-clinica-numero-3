import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export interface CreateTreatmentData {
  slug: string;
  title: string;
  description: string;
  fullDescription?: string;
  price?: number;
  heroImage?: string;
  gallery?: string[];
  benefits?: string[];
  observations?: string;
  isActive?: boolean;
}

export interface UpdateTreatmentData extends Partial<CreateTreatmentData> {}

export const getAllTreatments = async (activeOnly: boolean = false) => {
  const where = activeOnly ? { isActive: true } : {};
  
  const treatments = await prisma.treatment.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          reviews: true,
        },
      },
    },
  });

  // Parsear campos JSON para arrays
  return treatments.map(treatment => ({
    ...treatment,
    gallery: treatment.gallery ? (typeof treatment.gallery === 'string' ? JSON.parse(treatment.gallery) : treatment.gallery) : [],
    benefits: treatment.benefits ? (typeof treatment.benefits === 'string' ? JSON.parse(treatment.benefits) : treatment.benefits) : [],
  }));
};

export const getTreatmentBySlug = async (slug: string) => {
  const treatment = await prisma.treatment.findUnique({
    where: { slug },
    include: {
      reviews: {
        where: { approved: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });

  if (!treatment) {
    throw new AppError('Tratamento não encontrado', 404);
  }

  // Parsear campos JSON para arrays
  return {
    ...treatment,
    gallery: treatment.gallery ? (typeof treatment.gallery === 'string' ? JSON.parse(treatment.gallery) : treatment.gallery) : [],
    benefits: treatment.benefits ? (typeof treatment.benefits === 'string' ? JSON.parse(treatment.benefits) : treatment.benefits) : [],
  };
};

export const getTreatmentById = async (id: string) => {
  const treatment = await prisma.treatment.findUnique({
    where: { id },
  });

  if (!treatment) {
    throw new AppError('Tratamento não encontrado', 404);
  }

  // Parsear campos JSON para arrays
  return {
    ...treatment,
    gallery: treatment.gallery ? (typeof treatment.gallery === 'string' ? JSON.parse(treatment.gallery) : treatment.gallery) : [],
    benefits: treatment.benefits ? (typeof treatment.benefits === 'string' ? JSON.parse(treatment.benefits) : treatment.benefits) : [],
  };
};

export const createTreatment = async (data: CreateTreatmentData) => {
  // Verificar se slug já existe
  const existing = await prisma.treatment.findUnique({
    where: { slug: data.slug },
  });

  if (existing) {
    throw new AppError('Já existe um tratamento com este slug', 409);
  }

  const treatment = await prisma.treatment.create({
    data: {
      slug: data.slug,
      title: data.title,
      description: data.description,
      fullDescription: data.fullDescription,
      price: data.price,
      heroImage: data.heroImage,
      gallery: Array.isArray(data.gallery) ? JSON.stringify(data.gallery) : (data.gallery || '[]'),
      benefits: Array.isArray(data.benefits) ? JSON.stringify(data.benefits) : (data.benefits || '[]'),
      observations: data.observations,
      isActive: data.isActive ?? true,
    },
  });

  // Parsear campos JSON para arrays no retorno
  return {
    ...treatment,
    gallery: treatment.gallery ? (typeof treatment.gallery === 'string' ? JSON.parse(treatment.gallery) : treatment.gallery) : [],
    benefits: treatment.benefits ? (typeof treatment.benefits === 'string' ? JSON.parse(treatment.benefits) : treatment.benefits) : [],
  };
};

export const updateTreatment = async (id: string, data: UpdateTreatmentData) => {
  // Verificar se tratamento existe
  await getTreatmentById(id);

  // Se estiver atualizando o slug, verificar se não existe outro com o mesmo slug
  if (data.slug) {
    const existing = await prisma.treatment.findFirst({
      where: {
        slug: data.slug,
        NOT: { id },
      },
    });

    if (existing) {
      throw new AppError('Já existe outro tratamento com este slug', 409);
    }
  }

  const updateData: any = { ...data };
  
  // Converter arrays para JSON strings se necessário
  if (updateData.gallery && Array.isArray(updateData.gallery)) {
    updateData.gallery = JSON.stringify(updateData.gallery);
  }
  if (updateData.benefits && Array.isArray(updateData.benefits)) {
    updateData.benefits = JSON.stringify(updateData.benefits);
  }

  const treatment = await prisma.treatment.update({
    where: { id },
    data: updateData,
  });

  // Parsear campos JSON para arrays no retorno
  return {
    ...treatment,
    gallery: treatment.gallery ? (typeof treatment.gallery === 'string' ? JSON.parse(treatment.gallery) : treatment.gallery) : [],
    benefits: treatment.benefits ? (typeof treatment.benefits === 'string' ? JSON.parse(treatment.benefits) : treatment.benefits) : [],
  };
};

export const deleteTreatment = async (id: string) => {
  await getTreatmentById(id);

  return await prisma.treatment.delete({
    where: { id },
  });
};



