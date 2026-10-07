import { prisma } from '../config/database';
import { AppError } from '../errors/AppError';
import { Prisma } from '@prisma/client';
import { CreateNeedInput, UpdateNeedInput, NeedQueryInput } from '../validators/need.validator';

export const DEFAULT_NEEDS = [
  {
    title: 'Notebook & Stationery Kits',
    quantity: '150 Kits',
    category: 'Education',
    urgency: 'HIGH',
    description: 'Ruled notebooks, pencil boxes, erasers, sharpeners, and scale sets for foundational literacy batches in open ground classrooms.',
    displayOrder: 1,
    isActive: true,
  },
  {
    title: 'Winter Sweaters & Warm Wear',
    quantity: '80 Sets',
    category: 'Winter Relief',
    urgency: 'CRITICAL',
    description: 'Warm woollen sweaters and shoes to protect children learning in open-air ground classes during harsh winter months.',
    displayOrder: 2,
    isActive: true,
  },
  {
    title: 'Refurbished Laptops for Computer Class',
    quantity: '3 Laptops',
    category: 'Digital Literacy',
    urgency: 'HIGH',
    description: 'Working laptops or Android tablets for digital library sessions, educational videos, and basic computer literacy.',
    displayOrder: 3,
    isActive: true,
  },
  {
    title: 'Healthy Snack & Nutrition Packs',
    quantity: '200 Packs / Month',
    category: 'Nutrition',
    urgency: 'HIGH',
    description: 'Nutritious biscuits, fruits, and milk packets to ensure children study with energy and nutrition.',
    displayOrder: 4,
    isActive: true,
  },
  {
    title: 'School Bags & Water Bottles',
    quantity: '60 Bags',
    category: 'Education',
    urgency: 'MEDIUM',
    description: 'Durable school bags for children transitioning from footpath classes to mainstream partner schools.',
    displayOrder: 5,
    isActive: true,
  },
];

export const needService = {
  async listNeeds(query: NeedQueryInput, isPublicRequest: boolean = true) {
    const totalCount = await prisma.ngoNeed.count();
    if (totalCount === 0) {
      for (const item of DEFAULT_NEEDS) {
        await prisma.ngoNeed.create({ data: item });
      }
    }

    const where: Prisma.NgoNeedWhereInput = {};

    if (isPublicRequest) {
      where.isActive = true;
    } else if (query.isActive !== undefined) {
      where.isActive = query.isActive === 'true';
    }

    if (query.category) {
      where.category = query.category;
    }

    if (query.urgency) {
      where.urgency = query.urgency;
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { category: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const items = await prisma.ngoNeed.findMany({
      where,
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return items;
  },

  async seedDefaultNeeds() {
    await prisma.ngoNeed.deleteMany({});
    for (const item of DEFAULT_NEEDS) {
      await prisma.ngoNeed.create({ data: item });
    }
    return prisma.ngoNeed.findMany({
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    });
  },

  async getNeedById(id: string) {
    const item = await prisma.ngoNeed.findUnique({
      where: { id }
    });

    if (!item) {
      throw new AppError('Need not found', 404);
    }

    return item;
  },

  async createNeed(data: CreateNeedInput) {
    const item = await prisma.ngoNeed.create({
      data: {
        title: data.title,
        category: data.category || null,
        quantity: data.quantity || null,
        urgency: data.urgency || 'HIGH',
        description: data.description || null,
        isActive: data.isActive ?? true,
        displayOrder: data.displayOrder ?? 0,
      }
    });

    return item;
  },

  async updateNeed(id: string, data: UpdateNeedInput) {
    const existing = await prisma.ngoNeed.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Need not found', 404);
    }

    const item = await prisma.ngoNeed.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.quantity !== undefined && { quantity: data.quantity }),
        ...(data.urgency !== undefined && { urgency: data.urgency }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
      }
    });

    return item;
  },

  async deleteNeed(id: string) {
    const existing = await prisma.ngoNeed.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Need not found', 404);
    }

    await prisma.ngoNeed.delete({
      where: { id }
    });

    return { success: true };
  }
};
