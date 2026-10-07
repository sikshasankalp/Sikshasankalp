import { prisma } from '../config/database';
import { AppError } from '../errors/AppError';
import { CreateImpactMetricInput, UpdateImpactMetricInput } from '../validators/impact.validator';

export const impactService = {
  async listImpactMetrics(isPublicRequest: boolean) {
    let metrics = await prisma.impactMetric.findMany({
      where: isPublicRequest ? { isPublished: true } : undefined,
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'asc' }
      ]
    });

    if (metrics.length === 0) {
      await prisma.impactMetric.createMany({
        data: [
          {
            value: 42,
            label: 'Children Supported',
            description: 'Guided and supported toward school admission and mainstream education.',
            displayOrder: 1,
            isPublished: true,
          },
          {
            value: 35,
            label: 'Families Supported',
            description: 'Provided with portable bath tents, helping improve privacy, hygiene, and dignity.',
            displayOrder: 2,
            isPublished: true,
          }
        ]
      });

      metrics = await prisma.impactMetric.findMany({
        where: isPublicRequest ? { isPublished: true } : undefined,
        orderBy: [
          { displayOrder: 'asc' },
          { createdAt: 'asc' }
        ]
      });
    }

    return metrics;
  },

  async getImpactMetricById(id: string, isPublicRequest: boolean) {
    const metric = await prisma.impactMetric.findFirst({
      where: isPublicRequest ? { id, isPublished: true } : { id },
    });

    if (!metric) {
      throw new AppError('Impact metric not found', 404);
    }
    return metric;
  },

  async createImpactMetric(data: CreateImpactMetricInput) {
    const metric = await prisma.impactMetric.create({
      data: {
        value: data.value,
        label: data.label,
        description: data.description,
        displayOrder: data.displayOrder ?? 0,
        isPublished: data.isPublished ?? true,
      }
    });
    return metric;
  },

  async updateImpactMetric(id: string, data: UpdateImpactMetricInput) {
    const existing = await prisma.impactMetric.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Impact metric not found', 404);
    }

    const metric = await prisma.impactMetric.update({
      where: { id },
      data: {
        value: data.value,
        label: data.label,
        description: data.description,
        displayOrder: data.displayOrder,
        isPublished: data.isPublished,
      }
    });
    return metric;
  },

  async deleteImpactMetric(id: string) {
    const existing = await prisma.impactMetric.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Impact metric not found', 404);
    }

    await prisma.impactMetric.delete({ where: { id } });
    return { success: true };
  }
};
