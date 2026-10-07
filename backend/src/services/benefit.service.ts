import { prisma } from '../config/database';
import { AppError } from '../errors/AppError';
import { CreateBenefitInput, UpdateBenefitInput } from '../validators/benefit.validator';

const DEFAULT_SUPPORT_BENEFITS = [
  { title: 'Foundational Education & Learning', displayOrder: 1, isActive: true },
  { title: 'School Admission & Transition Support', displayOrder: 2, isActive: true },
  { title: 'Essential Educational Materials', displayOrder: 3, isActive: true },
  { title: 'Free Digital Siksha & Library Access', displayOrder: 4, isActive: true },
  { title: 'Health Checkups & Hygiene Initiatives', displayOrder: 5, isActive: true },
  { title: 'Direct Family & Community Support', displayOrder: 6, isActive: true },
];

export const benefitService = {
  async listBenefits(isPublicRequest: boolean = true) {
    const count = await prisma.supportBenefit.count();
    if (count === 0) {
      // Auto-seed if empty
      for (const item of DEFAULT_SUPPORT_BENEFITS) {
        await prisma.supportBenefit.create({ data: item });
      }
    }

    const where = isPublicRequest ? { isActive: true } : {};
    return prisma.supportBenefit.findMany({
      where,
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
    });
  },

  async getBenefitById(id: string) {
    const item = await prisma.supportBenefit.findUnique({ where: { id } });
    if (!item) throw new AppError('Benefit item not found', 404);
    return item;
  },

  async createBenefit(data: CreateBenefitInput) {
    return prisma.supportBenefit.create({
      data: {
        title: data.title,
        displayOrder: data.displayOrder ?? 0,
        isActive: data.isActive ?? true,
      },
    });
  },

  async updateBenefit(id: string, data: UpdateBenefitInput) {
    const existing = await prisma.supportBenefit.findUnique({ where: { id } });
    if (!existing) throw new AppError('Benefit item not found', 404);

    return prisma.supportBenefit.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });
  },

  async deleteBenefit(id: string) {
    const existing = await prisma.supportBenefit.findUnique({ where: { id } });
    if (!existing) throw new AppError('Benefit item not found', 404);

    await prisma.supportBenefit.delete({ where: { id } });
    return { success: true };
  },

  async seedDefaultBenefits() {
    await prisma.supportBenefit.deleteMany({});
    for (const item of DEFAULT_SUPPORT_BENEFITS) {
      await prisma.supportBenefit.create({ data: item });
    }
    return prisma.supportBenefit.findMany({
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
    });
  },
};
