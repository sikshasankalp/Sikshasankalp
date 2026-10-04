import {
  GalleryCategory,
  Prisma
} from '@prisma/client';

import { prisma } from '../config/database';
import { AppError } from '../errors/AppError';

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
  displayLocation: true,
  eventDate: true,
  isFeatured: true,
  isPublished: true,
  createdAt: true,
  updatedAt: true
} satisfies Prisma.GalleryItemSelect;

const adminSelect = {
  ...publicSelect,
  cloudinaryPublicId: true
} satisfies Prisma.GalleryItemSelect;

type PublicGalleryItem =
  Prisma.GalleryItemGetPayload<{
    select: typeof publicSelect;
  }>;

type AdminGalleryItem =
  Prisma.GalleryItemGetPayload<{
    select: typeof adminSelect;
  }>;

async function getGalleryItemById(
  id: string,
  isPublicRequest: true
): Promise<PublicGalleryItem>;

async function getGalleryItemById(
  id: string,
  isPublicRequest: false
): Promise<AdminGalleryItem>;

async function getGalleryItemById(
  id: string,
  isPublicRequest: boolean
): Promise<PublicGalleryItem | AdminGalleryItem> {
  const item = await prisma.galleryItem.findFirst({
    where: isPublicRequest
      ? {
          id,
          isPublished: true
        }
      : {
          id
        },
    select: isPublicRequest
      ? publicSelect
      : adminSelect
  });

  if (!item) {
    throw new AppError(
      'Gallery item not found',
      404
    );
  }

  return item;
}

export const galleryService = {
  async listGalleryItems(
    query: GalleryQueryInput,
    isPublicRequest: boolean
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const skip = (page - 1) * limit;

    const where: Prisma.GalleryItemWhereInput = {};

    if (query.category) {
      where.category =
        query.category as GalleryCategory;
    }

    if (query.displayLocation) {
      where.displayLocation =
        query.displayLocation;
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
        orderBy: [
          {
            createdAt: 'desc'
          },
          {
            id: 'desc'
          }
        ],
        select: isPublicRequest
          ? publicSelect
          : adminSelect
      }),

      prisma.galleryItem.count({
        where
      })
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(
          total / limit
        )
      }
    };
  },

  getGalleryItemById,

  async createGalleryItem(
    data: CreateGalleryInput,
    imageUrl: string,
    cloudinaryPublicId: string
  ) {
    if (!imageUrl) {
      throw new AppError(
        'Image URL is required',
        400
      );
    }

    return prisma.galleryItem.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl,
        cloudinaryPublicId,
        category:
          data.category as
            | GalleryCategory
            | undefined,
        displayLocation:
          data.displayLocation,
        eventDate: data.eventDate,
        isFeatured:
          data.isFeatured ?? false,
        isPublished:
          data.isPublished ?? false
      },
      select: adminSelect
    });
  },

  async updateGalleryItem(
    id: string,
    data: UpdateGalleryInput,
    imageUrl?: string,
    cloudinaryPublicId?: string
  ) {
    const updateData: Prisma.GalleryItemUpdateInput =
      {};

    if (data.title !== undefined) {
      updateData.title = data.title;
    }

    if (data.description !== undefined) {
      updateData.description =
        data.description;
    }

    if (imageUrl !== undefined) {
      updateData.imageUrl = imageUrl;
    }

    if (
      cloudinaryPublicId !== undefined
    ) {
      updateData.cloudinaryPublicId =
        cloudinaryPublicId;
    }

    if (data.category !== undefined) {
      updateData.category =
        data.category as GalleryCategory;
    }

    if (
      data.displayLocation !== undefined
    ) {
      updateData.displayLocation =
        data.displayLocation;
    }

    if (data.eventDate !== undefined) {
      updateData.eventDate =
        data.eventDate;
    }

    if (data.isFeatured !== undefined) {
      updateData.isFeatured =
        data.isFeatured;
    }

    if (data.isPublished !== undefined) {
      updateData.isPublished =
        data.isPublished;
    }

    try {
      return await prisma.galleryItem.update({
        where: { id },
        data: updateData,
        select: adminSelect
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new AppError(
          'Gallery item not found',
          404
        );
      }

      throw error;
    }
  },

  async deleteGalleryItem(
    id: string
  ) {
    try {
      await prisma.galleryItem.delete({
        where: { id }
      });

      return {
        success: true
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new AppError(
          'Gallery item not found',
          404
        );
      }

      throw error;
    }
  }
};