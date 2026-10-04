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
  category: true,
  displayLocation: true,
  publishedAt: true,
  isFeatured: true,
  isPublished: true,
  createdAt: true,
  updatedAt: true
} satisfies Prisma.MediaCoverageSelect;

const adminSelect = {
  ...publicSelect,
  cloudinaryPublicId: true
} satisfies Prisma.MediaCoverageSelect;

type PublicMedia = Prisma.MediaCoverageGetPayload<{
  select: typeof publicSelect;
}>;

type AdminMedia = Prisma.MediaCoverageGetPayload<{
  select: typeof adminSelect;
}>;

type MediaResult<T extends boolean> =
  T extends true ? PublicMedia : AdminMedia;

type MediaListResult<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

/* -------------------------------------------------------------------------- */
/* GET MEDIA BY ID                                                            */
/* -------------------------------------------------------------------------- */

async function getMediaById<T extends boolean>(
  id: string,
  isPublicRequest: T
): Promise<MediaResult<T>> {
  const item = await prisma.mediaCoverage.findFirst({
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
      'Media coverage not found',
      404
    );
  }

  return item as MediaResult<T>;
}

/* -------------------------------------------------------------------------- */
/* LIST MEDIA                                                                 */
/* -------------------------------------------------------------------------- */

async function listMedia<T extends boolean>(
  query: MediaQueryInput,
  isPublicRequest: T
): Promise<MediaListResult<MediaResult<T>>> {
  const page = query.page ?? 1;
  const limit = query.limit ?? 12;
  const skip = (page - 1) * limit;

  const where: Prisma.MediaCoverageWhereInput = {};

  if (query.category) {
    where.category = query.category;
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
    prisma.mediaCoverage.findMany({
      where,
      skip,
      take: limit,
      orderBy: [
        {
          publishedAt: 'desc'
        },
        {
          createdAt: 'desc'
        }
      ],
      select: isPublicRequest
        ? publicSelect
        : adminSelect
    }),

    prisma.mediaCoverage.count({
      where
    })
  ]);

  return {
    data: items as MediaResult<T>[],
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}

/* -------------------------------------------------------------------------- */
/* CREATE MEDIA                                                               */
/* -------------------------------------------------------------------------- */

async function createMedia(
  data: CreateMediaInput,
  cloudinaryPublicId?: string
): Promise<AdminMedia> {
  return prisma.mediaCoverage.create({
    data: {
      title: data.title || 'Untitled Article',
      publication: data.publication || 'Unknown Publication',
      description: data.description,
      thumbnailUrl: data.thumbnailUrl,
      cloudinaryPublicId: cloudinaryPublicId,
      externalUrl: data.externalUrl,
      category: data.category,
      displayLocation:
        data.displayLocation,
      publishedAt: data.publishedAt,
      isFeatured:
        data.isFeatured ?? false,
      isPublished:
        data.isPublished ?? true
    },
    select: adminSelect
  });
}

/* -------------------------------------------------------------------------- */
/* UPDATE MEDIA                                                               */
/* -------------------------------------------------------------------------- */

async function updateMedia(
  id: string,
  data: UpdateMediaInput,
  cloudinaryPublicId?: string
): Promise<AdminMedia> {
  try {
    return await prisma.mediaCoverage.update({
      where: { id },
      data: {
        title: data.title || 'Untitled Article',
        publication: data.publication || 'Unknown Publication',
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        cloudinaryPublicId: cloudinaryPublicId !== undefined ? cloudinaryPublicId : undefined,
        externalUrl: data.externalUrl,
        category: data.category,
        displayLocation:
          data.displayLocation,
        publishedAt: data.publishedAt,
        isFeatured: data.isFeatured,
        isPublished: data.isPublished
      },
      select: adminSelect
    });
  } catch (error) {
    if (
      error instanceof
        Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new AppError(
        'Media coverage not found',
        404
      );
    }

    throw error;
  }
}

/* -------------------------------------------------------------------------- */
/* DELETE MEDIA                                                               */
/* -------------------------------------------------------------------------- */

async function deleteMedia(
  id: string
): Promise<{ success: true }> {
  try {
    await prisma.mediaCoverage.delete({
      where: { id }
    });

    return {
      success: true
    };
  } catch (error) {
    if (
      error instanceof
        Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new AppError(
        'Media coverage not found',
        404
      );
    }

    throw error;
  }
}

/* -------------------------------------------------------------------------- */
/* SERVICE                                                                    */
/* -------------------------------------------------------------------------- */

export const mediaService = {
  listMedia,
  getMediaById,
  createMedia,
  updateMedia,
  deleteMedia
};