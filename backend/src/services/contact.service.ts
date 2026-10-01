import { prisma } from '../config/database';
import { AppError } from '../errors/AppError';
import { Prisma, ContactStatus } from '@prisma/client';
import { 
  CreateContactInput, 
  UpdateContactInput, 
  ContactQueryInput 
} from '../validators/contact.validator';

const adminSelect = {
  id: true,
  name: true,
  email: true,
  mobile: true,
  subject: true,
  message: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ContactMessageSelect;

export const contactService = {
  async listContactMessages(query: ContactQueryInput) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const skip = (page - 1) * limit;

    const where: Prisma.ContactMessageWhereInput = {};

    if (query.status) {
      where.status = query.status as ContactStatus;
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { subject: { contains: query.search, mode: 'insensitive' } },
        { message: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    const [items, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: adminSelect,
      }),
      prisma.contactMessage.count({ where }),
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

  async getContactMessageById(id: string) {
    const item = await prisma.contactMessage.findUnique({
      where: { id },
      select: adminSelect,
    });

    if (!item) {
      throw new AppError('Contact message not found', 404);
    }

    return item;
  },

  async createContactMessage(data: CreateContactInput) {
    const item = await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email || null,
        mobile: data.mobile,
        subject: data.subject,
        message: data.message,
        status: 'NEW',
      },
      select: adminSelect,
    });

    return item;
  },

  async updateContactMessage(id: string, data: UpdateContactInput) {
    const existing = await prisma.contactMessage.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Contact message not found', 404);
    }

    const item = await prisma.contactMessage.update({
      where: { id },
      data: {
        status: data.status as ContactStatus,
      },
      select: adminSelect,
    });

    return item;
  },

  async deleteContactMessage(id: string) {
    const existing = await prisma.contactMessage.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Contact message not found', 404);
    }

    await prisma.contactMessage.delete({
      where: { id },
    });

    return { success: true };
  }
};
