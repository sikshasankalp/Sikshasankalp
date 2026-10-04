import { prisma } from '../config/database';

type DashboardActivity = {
  id: string;
  type: 'donation' | 'volunteer' | 'contact' | 'gallery';
  message: string;
  createdAt: Date;
};

export const adminService = {
  async getDashboardStats() {
    const [
      successfulDonationsResult,
      totalVolunteers,
      pendingVolunteers,
      publishedGallery,
      publishedPrograms,
      recentDonations,
      recentVolunteers,
      recentContacts,
      recentGallery
    ] = await Promise.all([
      prisma.donation.aggregate({
        _sum: {
          amount: true
        },
        _count: {
          id: true
        },
        where: {
          status: 'SUCCESS'
        }
      }),

      prisma.volunteer.count(),

      prisma.volunteer.count({
        where: {
          status: 'NEW'
        }
      }),

      prisma.galleryItem.count({
        where: {
          isPublished: true
        }
      }),

      prisma.program.count({
        where: {
          isPublished: true
        }
      }),

      prisma.donation.findMany({
        where: {
          status: 'SUCCESS'
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5,
        select: {
          id: true,
          amount: true,
          donorName: true,
          createdAt: true
        }
      }),

      prisma.volunteer.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        take: 5,
        select: {
          id: true,
          name: true,
          createdAt: true
        }
      }),

      prisma.contactMessage.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        take: 5,
        select: {
          id: true,
          name: true,
          createdAt: true
        }
      }),

      prisma.galleryItem.findMany({
        where: {
          isPublished: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5,
        select: {
          id: true,
          title: true,
          createdAt: true
        }
      })
    ]);

    const activities: DashboardActivity[] = [];

    recentDonations.forEach((donation) => {
      activities.push({
        id: `don-${donation.id}`,
        type: 'donation',
        message: `New donation received from ${donation.donorName} (₹${donation.amount})`,
        createdAt: donation.createdAt
      });
    });

    recentVolunteers.forEach((volunteer) => {
      activities.push({
        id: `vol-${volunteer.id}`,
        type: 'volunteer',
        message: `New volunteer enquiry from ${volunteer.name}`,
        createdAt: volunteer.createdAt
      });
    });

    recentContacts.forEach((contact) => {
      activities.push({
        id: `con-${contact.id}`,
        type: 'contact',
        message: `New contact message from ${contact.name}`,
        createdAt: contact.createdAt
      });
    });

    recentGallery.forEach((galleryItem) => {
      activities.push({
        id: `gal-${galleryItem.id}`,
        type: 'gallery',
        message: `Gallery item published (${galleryItem.title || 'Untitled'})`,
        createdAt: galleryItem.createdAt
      });
    });

    activities.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    const recentActivity = activities.slice(0, 10);

    return {
      donations: {
        totalAmount: successfulDonationsResult._sum.amount ?? 0,
        successfulCount: successfulDonationsResult._count.id ?? 0
      },

      volunteers: {
        total: totalVolunteers,
        pending: pendingVolunteers
      },

      gallery: {
        published: publishedGallery
      },

      programs: {
        published: publishedPrograms
      },

      recentActivity
    };
  }
};