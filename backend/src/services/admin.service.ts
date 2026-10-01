import { prisma } from '../config/database';

export const adminService = {
  async getDashboardStats() {
    const [donations, volunteers, messages, gallery, programs, team, partners] = await Promise.all([
      prisma.donation.count(),
      prisma.volunteer.count(),
      prisma.contactMessage.count(),
      prisma.galleryItem.count(),
      prisma.program.count(),
      prisma.teamMember.count(),
      prisma.partnerEnquiry.count(),
    ]);

    return {
      donations,
      volunteers,
      messages,
      gallery,
      programs,
      team,
      partners
    };
  }
};
