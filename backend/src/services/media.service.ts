import { prisma } from '../config/database';
import { AppError } from '../errors/AppError';
import { Prisma } from '@prisma/client';
import { 
  CreateMediaInput, 
  UpdateMediaInput, 
  MediaQueryInput 
} from '../validators/media.validator';

const publicSelect = {
  id: true,
  title: true,
  publication: true,
  description: true,
  thumbnailUrl: true,
  externalUrl: true,
  publishedAt: true,
  isFeatured: true,
  isPublished: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.MediaCoverageSelect;

const adminSelect = {
  ...publicSelect,
  cloudinaryPublicId: true,
} satisfies Prisma.MediaCoverageSelect;

export const mediaService = {
  async listMedia(query: MediaQueryInput, isPublicRequest: boolean) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const skip = (page - 1) * limit;

    const where: Prisma.MediaCoverageWhereInput = {};

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
      prisma.mediaCoverage.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        select: isPublicRequest ? publicSelect : adminSelect,
      }),
      prisma.mediaCoverage.count({ where }),
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

  async getMediaById(id: string, isPublicRequest: boolean) {
    const item = await prisma.mediaCoverage.findFirst({
      where: isPublicRequest ? { id, isPublished: true } : { id },
      select: isPublicRequest ? publicSelect : adminSelect,
    });

    if (!item) {
      throw new AppError('Media coverage not found', 404);
    }

    return item;
  },

  async createMedia(data: CreateMediaInput) {
    const item = await prisma.mediaCoverage.create({
      data: {
        title: data.title,
        publication: data.publication,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        cloudinaryPublicId: data.cloudinaryPublicId,
        externalUrl: data.externalUrl,
        publishedAt: data.publishedAt,
        isFeatured: data.isFeatured ?? false,
        isPublished: data.isPublished ?? true,
      },
      select: adminSelect,
    });

    return item;
  },

  async updateMedia(id: string, data: UpdateMediaInput) {
    const existing = await prisma.mediaCoverage.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Media coverage not found', 404);
    }

    const item = await prisma.mediaCoverage.update({
      where: { id },
      data: {
        title: data.title,
        publication: data.publication,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        cloudinaryPublicId: data.cloudinaryPublicId,
        externalUrl: data.externalUrl,
        publishedAt: data.publishedAt,
        isFeatured: data.isFeatured,
        isPublished: data.isPublished,
      },
      select: adminSelect,
    });

    return item;
  },

  async deleteMedia(id: string) {
    const existing = await prisma.mediaCoverage.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Media coverage not found', 404);
    }

    await prisma.mediaCoverage.delete({
      where: { id },
    });

    return { success: true };
  }
};
