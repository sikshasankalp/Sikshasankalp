import { prisma } from '../config/database';
import { AppError } from '../errors/AppError';
import { Prisma } from '@prisma/client';
import {
  CreateLibraryInput,
  UpdateLibraryInput,
  LibraryQueryInput,
} from '../validators/library.validator';

const publicSelect = {
  id: true,
  title: true,
  description: true,
  category: true,
  fileUrl: true,
  thumbnailUrl: true,
  fileType: true,
  fileSize: true,
  isPublished: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.DigitalLibrarySelect;

const adminSelect = {
  ...publicSelect,
  cloudinaryPublicId: true,
} satisfies Prisma.DigitalLibrarySelect;

export const libraryService = {
  async listLibraryResources(
    query: LibraryQueryInput,
    isPublicRequest: boolean,
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const skip = (page - 1) * limit;

    const where: Prisma.DigitalLibraryWhereInput = {};

    if (query.category) {
      where.category = query.category;
    }

    if (query.search) {
      where.OR = [
        {
          title: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (isPublicRequest) {
      where.isPublished = true;
    } else if (query.published !== undefined) {
      where.isPublished = query.published;
    }

    const [items, total] = await Promise.all([
      prisma.digitalLibrary.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { createdAt: 'desc' },
          { id: 'desc' },
        ],
        select: isPublicRequest ? publicSelect : adminSelect,
      }),

      prisma.digitalLibrary.count({
        where,
      }),
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

  async getLibraryResourceById(
    id: string,
    isPublicRequest: boolean,
  ) {
    const item = await prisma.digitalLibrary.findFirst({
      where: isPublicRequest
        ? {
            id,
            isPublished: true,
          }
        : {
            id,
          },
      select: isPublicRequest ? publicSelect : adminSelect,
    });

    if (!item) {
      throw new AppError(
        'Library resource not found',
        404,
      );
    }

    return item;
  },

  async createLibraryResource(
    data: CreateLibraryInput,
    fileUrl: string,
    cloudinaryPublicId?: string,
    thumbnailUrl?: string,
  ) {
    const item = await prisma.digitalLibrary.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        fileUrl,
        cloudinaryPublicId,
        thumbnailUrl,
        fileType: data.fileType,
        fileSize: data.fileSize,

        // New CMS resources should not become public
        // until explicitly published.
        isPublished: data.isPublished ?? false,
      },
      select: adminSelect,
    });

    return item;
  },

  async updateLibraryResource(
    id: string,
    data: UpdateLibraryInput,
    fileUrl?: string,
    cloudinaryPublicId?: string,
    thumbnailUrl?: string,
  ) {
    const existing = await prisma.digitalLibrary.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new AppError(
        'Library resource not found',
        404,
      );
    }

    const updateData: Prisma.DigitalLibraryUpdateInput = {};

    if (data.title !== undefined) {
      updateData.title = data.title;
    }

    if (data.description !== undefined) {
      updateData.description = data.description;
    }

    if (data.category !== undefined) {
      updateData.category = data.category;
    }

    if (data.fileType !== undefined) {
      updateData.fileType = data.fileType;
    }

    if (data.fileSize !== undefined) {
      updateData.fileSize = data.fileSize;
    }

    if (data.isPublished !== undefined) {
      updateData.isPublished = data.isPublished;
    }

    if (fileUrl !== undefined) {
      updateData.fileUrl = fileUrl;
    }

    if (cloudinaryPublicId !== undefined) {
      updateData.cloudinaryPublicId = cloudinaryPublicId;
    }

    if (thumbnailUrl !== undefined) {
      updateData.thumbnailUrl = thumbnailUrl;
    }

    const item = await prisma.digitalLibrary.update({
      where: { id },
      data: updateData,
      select: adminSelect,
    });

    return {
      item,
      previousCloudinaryPublicId:
        existing.cloudinaryPublicId,
    };
  },

  async deleteLibraryResource(id: string) {
    const existing = await prisma.digitalLibrary.findUnique({
      where: { id },
      select: {
        id: true,
        cloudinaryPublicId: true,
      },
    });

    if (!existing) {
      throw new AppError(
        'Library resource not found',
        404,
      );
    }

    await prisma.digitalLibrary.delete({
      where: { id },
    });

    return {
      success: true,
      cloudinaryPublicId:
        existing.cloudinaryPublicId,
    };
  },
};