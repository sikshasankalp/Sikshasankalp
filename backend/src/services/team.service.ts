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
  photoUrl: true,
  displayOrder: true,
  isPublished: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.TeamMemberSelect;

const adminSelect = {
  ...publicSelect,
  cloudinaryPublicId: true,
} satisfies Prisma.TeamMemberSelect;

export const teamService = {
  async listTeamMembers(query: TeamQueryInput, isPublicRequest: boolean) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const skip = (page - 1) * limit;

    const where: Prisma.TeamMemberWhereInput = {};

    if (isPublicRequest) {
      where.isPublished = true;
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
        orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
        select: isPublicRequest ? publicSelect : adminSelect,
      }),
      prisma.teamMember.count({ where }),
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

  async getTeamMemberById(id: string, isPublicRequest: boolean) {
    const item = await prisma.teamMember.findFirst({
      where: isPublicRequest ? { id, isPublished: true } : { id },
      select: isPublicRequest ? publicSelect : adminSelect,
    });

    if (!item) {
      throw new AppError('Team member not found', 404);
    }

    return item;
  },

  async createTeamMember(data: CreateTeamInput) {
    const item = await prisma.teamMember.create({
      data: {
        name: data.name,
        designation: data.designation,
        bio: data.bio,
        photoUrl: data.photoUrl,
        cloudinaryPublicId: data.cloudinaryPublicId,
        displayOrder: data.displayOrder ?? 0,
        isPublished: data.isPublished ?? true,
      },
      select: adminSelect,
    });

    return item;
  },

  async updateTeamMember(id: string, data: UpdateTeamInput) {
    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Team member not found', 404);
    }

    const item = await prisma.teamMember.update({
      where: { id },
      data: {
        name: data.name,
        designation: data.designation,
        bio: data.bio,
        photoUrl: data.photoUrl,
        cloudinaryPublicId: data.cloudinaryPublicId,
        displayOrder: data.displayOrder,
        isPublished: data.isPublished,
      },
      select: adminSelect,
    });

    return item;
  },

  async deleteTeamMember(id: string) {
    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Team member not found', 404);
    }

    await prisma.teamMember.delete({
      where: { id },
    });

    return { success: true };
  }
};
