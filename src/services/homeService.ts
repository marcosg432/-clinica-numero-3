import prisma from '../config/database';

export const getHomeData = async () => {
  const [treatments, reviews, clinicInfo] = await Promise.all([
    prisma.treatment.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        heroImage: true,
        price: true,
      },
    }),
    prisma.review.findMany({
      where: { approved: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        treatment: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    }),
    prisma.clinicInfo.findFirst(),
  ]);

  return {
    banner: {
      title: 'Transforme seu sorriso',
      subtitle: 'Tecnologia e carinho para o seu melhor sorriso',
    },
    about: {
      title: 'Quem somos',
      description: 'Com os mais avançados recursos de diagnóstico, planejamento e tratamento, nossa abordagem é sempre atual e segura. Nosso instrumental recebe esterilização perfeita em autoclave e nossos materiais são descartáveis e de alta qualidade.',
    },
    treatments,
    reviews,
    clinicInfo,
  };
};

export const getGallery = async () => {
  const treatments = await prisma.treatment.findMany({
    where: { isActive: true },
    select: {
      heroImage: true,
      gallery: true,
    },
  });

  const images: string[] = [];
  treatments.forEach((treatment) => {
    if (treatment.heroImage) images.push(treatment.heroImage);
    if (treatment.gallery) {
      try {
        const galleryArray = JSON.parse(treatment.gallery);
        if (Array.isArray(galleryArray)) {
          images.push(...galleryArray);
        }
      } catch (e) {
        // Ignora se não for JSON válido
      }
    }
  });

  return images;
};



