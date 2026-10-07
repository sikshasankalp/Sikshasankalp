import { prisma } from '../config/database';
import { AppError } from '../errors/AppError';
import { Prisma } from '@prisma/client';
import { CreateNeedInput, UpdateNeedInput, NeedQueryInput } from '../validators/need.validator';

export const needService = {
  async listNeeds(query: NeedQueryInput, isPublicRequest: boolean = true) {
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
