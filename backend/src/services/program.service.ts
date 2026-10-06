import { Prisma } from '@prisma/client';

import { prisma } from '../config/database';
import { AppError } from '../errors/AppError';

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
  updatedAt: true
} satisfies Prisma.ProgramSelect;

const adminSelect = {
  ...publicSelect,
  cloudinaryPublicId: true
} satisfies Prisma.ProgramSelect;

type CreateProgramServiceInput =
  CreateProgramInput & {
    imageUrl?: string;
    cloudinaryPublicId?: string;
  };

type UpdateProgramServiceInput =
  UpdateProgramInput & {
    imageUrl?: string;
    cloudinaryPublicId?: string;
  };

type PublicProgram =
  Prisma.ProgramGetPayload<{
    select: typeof publicSelect;
  }>;

type AdminProgram =
  Prisma.ProgramGetPayload<{
    select: typeof adminSelect;
  }>;

const isUniqueConstraintError = (
  error: unknown
): error is Prisma.PrismaClientKnownRequestError => {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  );
};

const isNotFoundError = (
  error: unknown
): error is Prisma.PrismaClientKnownRequestError => {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2025'
  );
};

/**
 * Get a public program.
 */
async function getProgramById(
  id: string,
  isPublicRequest: true
): Promise<PublicProgram>;

/**
 * Get an admin program.
 */
async function getProgramById(
  id: string,
  isPublicRequest: false
): Promise<AdminProgram>;

/**
 * Get a program.
 */
async function getProgramById(
  id: string,
  isPublicRequest: boolean
): Promise<PublicProgram | AdminProgram> {
  const item = await prisma.program.findFirst({
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
      'Program not found',
      404
    );
  }

  return item;
}

export const programService = {
  async listPrograms(
    query: ProgramQueryInput,
    isPublicRequest: boolean
  ) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 12);
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
        orderBy: [
          {
            displayOrder: 'asc'
          },
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

      prisma.program.count({
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

  getProgramById,

  async createProgram(
    data: CreateProgramServiceInput
  ) {
    try {
      return await prisma.program.create({
        data: {
          title: data.title,
          slug: data.slug,
          shortDescription:
            data.shortDescription,
          description:
            data.description,
          imageUrl:
            data.imageUrl,
          cloudinaryPublicId:
            data.cloudinaryPublicId,
          isFeatured:
            data.isFeatured ?? false,
          isPublished:
            data.isPublished ?? false,
          displayOrder:
            data.displayOrder ?? 0
        },
        select: adminSelect
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new AppError(
          'Program slug must be unique',
          400
        );
      }

      throw error;
    }
  },

  async updateProgram(
    id: string,
    data: UpdateProgramServiceInput
  ) {
    const updateData: Prisma.ProgramUpdateInput =
      {};

    if (data.title !== undefined) {
      updateData.title = data.title;
    }

    if (data.slug !== undefined) {
      updateData.slug = data.slug;
    }

    if (
      data.shortDescription !== undefined
    ) {
      updateData.shortDescription =
        data.shortDescription;
    }

    if (data.description !== undefined) {
      updateData.description =
        data.description;
    }

    if (data.imageUrl !== undefined) {
      updateData.imageUrl =
        data.imageUrl;
    }

    if (
      data.cloudinaryPublicId !== undefined
    ) {
      updateData.cloudinaryPublicId =
        data.cloudinaryPublicId;
    }

    if (data.isFeatured !== undefined) {
      updateData.isFeatured =
        data.isFeatured;
    }

    if (data.isPublished !== undefined) {
      updateData.isPublished =
        data.isPublished;
    }

    if (data.displayOrder !== undefined) {
      updateData.displayOrder =
        data.displayOrder;
    }

    try {
      return await prisma.program.update({
        where: {
          id
        },
        data: updateData,
        select: adminSelect
      });
    } catch (error) {
      if (isNotFoundError(error)) {
        throw new AppError(
          'Program not found',
          404
        );
      }

      if (isUniqueConstraintError(error)) {
        throw new AppError(
          'Program slug must be unique',
          400
        );
      }

      throw error;
    }
  },

  async deleteProgram(
    id: string
  ) {
    try {
      await prisma.program.delete({
        where: {
          id
        }
      });
    } catch (error) {
      if (isNotFoundError(error)) {
        throw new AppError(
          'Program not found',
          404
        );
      }

      throw error;
    }

    return {
      success: true
    };
  }
};