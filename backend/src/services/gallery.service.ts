import { prisma } from '../config/database';
import { AppError } from '../errors/AppError';
import { GalleryCategory, Prisma } from '@prisma/client';
import { 
  CreateGalleryInput, 
  UpdateGalleryInput, 
  GalleryQueryInput 
} from '../validators/gallery.validator';

const publicSelect = {
  id: true,
  title: true,
  description: true,
  imageUrl: true,
  category: true,
  eventDate: true,
  isFeatured: true,
  isPublished: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.GalleryItemSelect;

const adminSelect = {
  ...publicSelect,
  cloudinaryPublicId: true,
} satisfies Prisma.GalleryItemSelect;

export const galleryService = {
  async listGalleryItems(query: GalleryQueryInput, isPublicRequest: boolean) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const skip = (page - 1) * limit;

    const where: Prisma.GalleryItemWhereInput = {};

    if (query.category) {
      where.category = query.category as GalleryCategory;
    }

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
      prisma.galleryItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: isPublicRequest ? publicSelect : adminSelect,
      }),
      prisma.galleryItem.count({ where }),
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

  async getGalleryItemById(id: string, isPublicRequest: boolean) {
    const item = await prisma.galleryItem.findFirst({
      where: isPublicRequest ? { id, isPublished: true } : { id },
      select: isPublicRequest ? publicSelect : adminSelect,
    });

    if (!item) {
      throw new AppError('Gallery item not found', 404);
    }

    return item;
  },

  async createGalleryItem(data: CreateGalleryInput) {
    const item = await prisma.galleryItem.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        cloudinaryPublicId: data.cloudinaryPublicId,
        category: data.category as GalleryCategory,
        eventDate: data.eventDate,
        isFeatured: data.isFeatured,
        isPublished: data.isPublished,
      },
      select: adminSelect,
    });

    return item;
  },

  async updateGalleryItem(id: string, data: UpdateGalleryInput) {
    const existing = await prisma.galleryItem.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Gallery item not found', 404);
    }

    const item = await prisma.galleryItem.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        cloudinaryPublicId: data.cloudinaryPublicId,
        category: data.category as GalleryCategory | undefined,
        eventDate: data.eventDate,
        isFeatured: data.isFeatured,
        isPublished: data.isPublished,
      },
      select: adminSelect,
    });

    return item;
  },

  async deleteGalleryItem(id: string) {
    const existing = await prisma.galleryItem.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Gallery item not found', 404);
    }

    await prisma.galleryItem.delete({
      where: { id },
    });

    return { success: true };
  }
};
