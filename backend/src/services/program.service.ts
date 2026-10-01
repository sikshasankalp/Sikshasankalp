import { prisma } from '../config/database';
import { AppError } from '../errors/AppError';
import { Prisma } from '@prisma/client';
import { 
  CreateProgramInput, 
  UpdateProgramInput, 
  ProgramQueryInput 
} from '../validators/program.validator';

const publicSelect = {
  id: true,
  title: true,
  slug: true,
  shortDescription: true,
  description: true,
  imageUrl: true,
  isFeatured: true,
  isPublished: true,
  displayOrder: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ProgramSelect;

const adminSelect = {
  ...publicSelect,
  cloudinaryPublicId: true,
} satisfies Prisma.ProgramSelect;

export const programService = {
  async listPrograms(query: ProgramQueryInput, isPublicRequest: boolean) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const skip = (page - 1) * limit;

    const where: Prisma.ProgramWhereInput = {};

    if (isPublicRequest) {
      where.isPublished = true;
      if (query.featured !== undefined) {
        where.isFeatured = query.featured;
      }
    } else {
      if (query.published !== undefined) {
        where.isPublished = query.published;
      }
      if (query.featured !== undefined) {
        where.isFeatured = query.featured;
      }
    }

    const [items, total] = await Promise.all([
      prisma.program.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
        select: isPublicRequest ? publicSelect : adminSelect,
      }),
      prisma.program.count({ where }),
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getProgramById(id: string, isPublicRequest: boolean) {
    const item = await prisma.program.findFirst({
      where: isPublicRequest ? { id, isPublished: true } : { id },
      select: isPublicRequest ? publicSelect : adminSelect,
    });

    if (!item) {
      throw new AppError('Program not found', 404);
    }

    return item;
  },

  async createProgram(data: CreateProgramInput) {
    // Ensure slug is unique
    const existingSlug = await prisma.program.findUnique({ where: { slug: data.slug } });
    if (existingSlug) {
      throw new AppError('Program slug must be unique', 400);
    }

    const item = await prisma.program.create({
      data: {
        title: data.title,
        slug: data.slug,
        shortDescription: data.shortDescription,
        description: data.description,
        imageUrl: data.imageUrl,
        cloudinaryPublicId: data.cloudinaryPublicId,
        isFeatured: data.isFeatured ?? false,
        isPublished: data.isPublished ?? true,
        displayOrder: data.displayOrder ?? 0,
      },
      select: adminSelect,
    });

    return item;
  },

  async updateProgram(id: string, data: UpdateProgramInput) {
    const existing = await prisma.program.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Program not found', 404);
    }

    if (data.slug && data.slug !== existing.slug) {
      const existingSlug = await prisma.program.findUnique({ where: { slug: data.slug } });
      if (existingSlug) {
        throw new AppError('Program slug must be unique', 400);
      }
    }

    const item = await prisma.program.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        shortDescription: data.shortDescription,
        description: data.description,
        imageUrl: data.imageUrl,
        cloudinaryPublicId: data.cloudinaryPublicId,
        isFeatured: data.isFeatured,
        isPublished: data.isPublished,
        displayOrder: data.displayOrder,
      },
      select: adminSelect,
    });

    return item;
  },

  async deleteProgram(id: string) {
    const existing = await prisma.program.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Program not found', 404);
    }

    await prisma.program.delete({
      where: { id },
    });

    return { success: true };
  }
};
