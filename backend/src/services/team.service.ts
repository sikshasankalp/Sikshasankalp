import { prisma } from '../config/database';
import { AppError } from '../errors/AppError';
import { Prisma } from '@prisma/client';

import {
  CreateTeamInput,
  UpdateTeamInput,
  TeamQueryInput
} from '../validators/team.validator';

const publicSelect = {
  id: true,
  name: true,
  designation: true,
  bio: true,
  responsibilities: true,
  expertise: true,
  department: true,
  photoUrl: true,
  displayOrder: true,
  isActive: true,
  isPublished: true,
  createdAt: true,
  updatedAt: true
} satisfies Prisma.TeamMemberSelect;

const adminSelect = {
  ...publicSelect,
  cloudinaryPublicId: true
} satisfies Prisma.TeamMemberSelect;

const isNotFoundError = (
  error: unknown
): error is Prisma.PrismaClientKnownRequestError => {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2025'
  );
};

type PublicTeamMember = Prisma.TeamMemberGetPayload<{ select: typeof publicSelect }>;
type AdminTeamMember = Prisma.TeamMemberGetPayload<{ select: typeof adminSelect }>;

export interface ITeamService {
  listTeamMembers<T extends boolean>(
    query: TeamQueryInput,
    isPublicRequest: T
  ): Promise<{
    data: (T extends true ? PublicTeamMember : AdminTeamMember)[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }>;

  getTeamMemberById<T extends boolean>(
    id: string,
    isPublicRequest: T
  ): Promise<T extends true ? PublicTeamMember : AdminTeamMember>;

  createTeamMember(data: CreateTeamInput & { cloudinaryPublicId?: string }): Promise<AdminTeamMember>;
  updateTeamMember(id: string, data: UpdateTeamInput & { cloudinaryPublicId?: string }): Promise<AdminTeamMember>;
  deleteTeamMember(id: string): Promise<{ success: boolean }>;
}

export const teamService: ITeamService = {
  async listTeamMembers<T extends boolean>(
    query: TeamQueryInput,
    isPublicRequest: T
  ): Promise<{
    data: (T extends true ? PublicTeamMember : AdminTeamMember)[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 12);
    const skip = (page - 1) * limit;

    const where: Prisma.TeamMemberWhereInput = {};

    if (isPublicRequest) {
      where.isPublished = true;
      where.isActive = true;
    } else {
      if (query.published !== undefined) {
        where.isPublished = query.published;
      }
    }

    const [items, total] = await Promise.all([
      prisma.teamMember.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { displayOrder: 'asc' },
          { createdAt: 'desc' }
        ],
        select: isPublicRequest
          ? publicSelect
          : adminSelect
      }),

      prisma.teamMember.count({ where })
    ]);

    return {
      data: items as (T extends true ? PublicTeamMember : AdminTeamMember)[],
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  async getTeamMemberById<T extends boolean>(
    id: string,
    isPublicRequest: T
  ): Promise<T extends true ? PublicTeamMember : AdminTeamMember> {
    const item = await prisma.teamMember.findFirst({
      where: isPublicRequest
        ? {
            id,
            isPublished: true,
            isActive: true
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
        'Team member not found',
        404
      );
    }

    return item as T extends true ? PublicTeamMember : AdminTeamMember;
  },

  async createTeamMember(
    data: CreateTeamInput & { cloudinaryPublicId?: string }
  ) {
    return prisma.teamMember.create({
      data: {
        name: data.name,
        designation: data.designation,
        bio: data.bio,
        responsibilities:
          data.responsibilities,
        expertise: data.expertise,
        department: data.department,
        photoUrl: data.photoUrl,
        cloudinaryPublicId:
          data.cloudinaryPublicId,
        displayOrder:
          data.displayOrder ?? 0,
        isActive:
          data.isActive ?? true,
        isPublished:
          data.isPublished ?? true
      },
      select: adminSelect
    });
  },

  async updateTeamMember(
    id: string,
    data: UpdateTeamInput & { cloudinaryPublicId?: string }
  ) {
    const updateData: Prisma.TeamMemberUpdateInput = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.designation !== undefined) {
      updateData.designation =
        data.designation;
    }

    if (data.bio !== undefined) {
      updateData.bio = data.bio;
    }

    if (data.responsibilities !== undefined) {
      updateData.responsibilities =
        data.responsibilities;
    }

    if (data.expertise !== undefined) {
      updateData.expertise =
        data.expertise;
    }

    if (data.department !== undefined) {
      updateData.department =
        data.department;
    }

    if (data.photoUrl !== undefined) {
      updateData.photoUrl =
        data.photoUrl;
    }

    if (data.cloudinaryPublicId !== undefined) {
      updateData.cloudinaryPublicId =
        data.cloudinaryPublicId;
    }

    if (data.displayOrder !== undefined) {
      updateData.displayOrder =
        data.displayOrder;
    }

    if (data.isActive !== undefined) {
      updateData.isActive =
        data.isActive;
    }

    if (data.isPublished !== undefined) {
      updateData.isPublished =
        data.isPublished;
    }

    try {
      return await prisma.teamMember.update({
        where: { id },
        data: updateData,
        select: adminSelect
      });
    } catch (error) {
      if (isNotFoundError(error)) {
        throw new AppError(
          'Team member not found',
          404
        );
      }

      throw error;
    }
  },

  async deleteTeamMember(id: string) {
    try {
      await prisma.teamMember.delete({
        where: { id }
      });
    } catch (error) {
      if (isNotFoundError(error)) {
        throw new AppError(
          'Team member not found',
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