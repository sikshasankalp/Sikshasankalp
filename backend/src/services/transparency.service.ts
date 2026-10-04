import { prisma } from '../config/database';
import { AppError } from '../errors/AppError';
import { Prisma } from '@prisma/client';
import { 
  CreateTransparencyInput, 
  UpdateTransparencyInput, 
  TransparencyQueryInput 
} from '../validators/transparency.validator';

const publicSelect = {
  id: true,
  title: true,
  documentType: true,
  documentNumber: true,
  documentUrl: true,
  issuedDate: true,
  description: true,
  isPublished: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.TransparencyDocumentSelect;

const adminSelect = {
  ...publicSelect,
  cloudinaryPublicId: true,
} satisfies Prisma.TransparencyDocumentSelect;

export const transparencyService = {
  async listTransparency(query: TransparencyQueryInput, isPublicRequest: boolean) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const skip = (page - 1) * limit;

    const where: Prisma.TransparencyDocumentWhereInput = {};

    if (query.documentType) {
      where.documentType = query.documentType;
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { documentNumber: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    if (isPublicRequest) {
      where.isPublished = true;
    } else {
      if (query.published !== undefined) {
        where.isPublished = query.published;
      }
    }

    const [items, total] = await Promise.all([
      prisma.transparencyDocument.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ issuedDate: 'desc' }, { createdAt: 'desc' }],
        select: isPublicRequest ? publicSelect : adminSelect,
      }),
      prisma.transparencyDocument.count({ where }),
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

  async getTransparencyById(id: string, isPublicRequest: boolean) {
    const item = await prisma.transparencyDocument.findFirst({
      where: isPublicRequest ? { id, isPublished: true } : { id },
      select: isPublicRequest ? publicSelect : adminSelect,
    });

    if (!item) {
      throw new AppError('Transparency document not found', 404);
    }

    return item;
  },

  async createTransparency(data: CreateTransparencyInput) {
    const item = await prisma.transparencyDocument.create({
      data: {
        title: data.title,
        documentType: data.documentType,
        documentNumber: data.documentNumber,
        documentUrl: data.documentUrl,
        issuedDate: data.issuedDate,
        description: data.description,
        isPublished: data.isPublished ?? true,
      },
      select: adminSelect,
    });

    return item;
  },

  async updateTransparency(id: string, data: UpdateTransparencyInput) {
    const existing = await prisma.transparencyDocument.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Transparency document not found', 404);
    }

    const item = await prisma.transparencyDocument.update({
      where: { id },
      data: {
        title: data.title,
        documentType: data.documentType,
        documentNumber: data.documentNumber,
        documentUrl: data.documentUrl,
        issuedDate: data.issuedDate,
        description: data.description,
        isPublished: data.isPublished,
      },
      select: adminSelect,
    });

    return item;
  },

  async deleteTransparency(id: string) {
    const existing = await prisma.transparencyDocument.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Transparency document not found', 404);
    }

    await prisma.transparencyDocument.delete({
      where: { id },
    });

    return { success: true };
  }
};
