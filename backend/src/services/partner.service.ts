import { prisma } from '../config/database';
import { AppError } from '../errors/AppError';
import { Prisma, PartnerStatus } from '@prisma/client';
import { 
  CreatePartnerInput, 
  UpdatePartnerInput, 
  PartnerQueryInput 
} from '../validators/partner.validator';

const adminSelect = {
  id: true,
  organizationName: true,
  contactPerson: true,
  email: true,
  mobile: true,
  organizationType: true,
  message: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.PartnerEnquirySelect;

export const partnerService = {
  async listPartnerInquiries(query: PartnerQueryInput) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 12);
    const skip = (page - 1) * limit;

    const where: Prisma.PartnerEnquiryWhereInput = {};

    if (query.status) {
      where.status = query.status as PartnerStatus;
    }

    if (query.organizationType) {
      where.organizationType = { equals: query.organizationType, mode: 'insensitive' };
    }

    if (query.search) {
      where.OR = [
        { organizationName: { contains: query.search, mode: 'insensitive' } },
        { contactPerson: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { message: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    const [items, total] = await Promise.all([
      prisma.partnerEnquiry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: adminSelect,
      }),
      prisma.partnerEnquiry.count({ where }),
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

  async getPartnerInquiryById(id: string) {
    const item = await prisma.partnerEnquiry.findUnique({
      where: { id },
      select: adminSelect,
    });

    if (!item) {
      throw new AppError('Partner inquiry not found', 404);
    }

    return item;
  },

  async createPartnerInquiry(data: CreatePartnerInput) {
    const item = await prisma.partnerEnquiry.create({
      data: {
        organizationName: data.organizationName,
        contactPerson: data.contactPerson,
        email: data.email,
        mobile: data.mobile,
        organizationType: data.organizationType,
        message: data.message,
        status: 'NEW',
      },
      select: adminSelect,
    });

    return item;
  },

  async updatePartnerInquiry(id: string, data: UpdatePartnerInput) {
    const existing = await prisma.partnerEnquiry.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Partner inquiry not found', 404);
    }

    const item = await prisma.partnerEnquiry.update({
      where: { id },
      data: {
        status: data.status as PartnerStatus,
      },
      select: adminSelect,
    });

    return item;
  },

  async deletePartnerInquiry(id: string) {
    const existing = await prisma.partnerEnquiry.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Partner inquiry not found', 404);
    }

    await prisma.partnerEnquiry.delete({
      where: { id },
    });

    return { success: true };
  }
};
