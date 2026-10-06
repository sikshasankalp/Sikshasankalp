import { prisma } from '../config/database';
import { AppError } from '../errors/AppError';
import { Prisma, VolunteerStatus } from '@prisma/client';
import { 
  CreateVolunteerInput, 
  UpdateVolunteerInput, 
  VolunteerQueryInput 
} from '../validators/volunteer.validator';

const adminSelect = {
  id: true,
  name: true,
  mobile: true,
  email: true,
  city: true,
  skills: true,
  interests: true,
  message: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.VolunteerSelect;

export const volunteerService = {
  async listVolunteerApplications(query: VolunteerQueryInput) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 12);
    const skip = (page - 1) * limit;

    const where: Prisma.VolunteerWhereInput = {};

    if (query.status) {
      where.status = query.status as VolunteerStatus;
    }

    if (query.city) {
      where.city = { equals: query.city, mode: 'insensitive' };
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { city: { contains: query.search, mode: 'insensitive' } },
        { skills: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    const [items, total] = await Promise.all([
      prisma.volunteer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: adminSelect,
      }),
      prisma.volunteer.count({ where }),
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

  async getVolunteerApplicationById(id: string) {
    const item = await prisma.volunteer.findUnique({
      where: { id },
      select: adminSelect,
    });

    if (!item) {
      throw new AppError('Volunteer application not found', 404);
    }

    return item;
  },

  async createVolunteerApplication(data: CreateVolunteerInput) {
    const item = await prisma.volunteer.create({
      data: {
        name: data.name,
        mobile: data.mobile,
        email: data.email || null,
        city: data.city,
        skills: data.skills,
        interests: data.interests,
        message: data.message,
        status: 'NEW',
      },
      select: adminSelect,
    });

    return item;
  },

  async updateVolunteerApplication(id: string, data: UpdateVolunteerInput) {
    const existing = await prisma.volunteer.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Volunteer application not found', 404);
    }

    const item = await prisma.volunteer.update({
      where: { id },
      data: {
        status: data.status as VolunteerStatus,
      },
      select: adminSelect,
    });

    return item;
  },

  async deleteVolunteerApplication(id: string) {
    const existing = await prisma.volunteer.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Volunteer application not found', 404);
    }

    await prisma.volunteer.delete({
      where: { id },
    });

    return { success: true };
  }
};
