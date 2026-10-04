import { Router } from 'express';

import authRoutes from './auth.routes';
import adminRoutes from './admin.routes';
import healthRoutes from './health.routes';
import galleryRoutes from './gallery.routes';
import programRoutes from './program.routes';
import teamRoutes from './team.routes';
import mediaRoutes from './media.routes';
import libraryRoutes from './library.routes';
import transparencyRoutes from './transparency.routes';
import volunteerRoutes from './volunteer.routes';
import partnerRoutes from './partner.routes';
import contactRoutes from './contact.routes';
import donationRoutes from './donation.routes';
import impactRoutes from './impact.routes';

const router = Router();

router.use('/health', healthRoutes);

router.use('/auth', authRoutes);

router.use('/admin', adminRoutes);

router.use('/gallery', galleryRoutes);

router.use('/programs', programRoutes);

router.use('/team', teamRoutes);

router.use('/media', mediaRoutes);

router.use('/library', libraryRoutes);

router.use('/transparency', transparencyRoutes);

router.use('/volunteers', volunteerRoutes);

router.use('/partners', partnerRoutes);

router.use('/contact', contactRoutes);

router.use('/donations', donationRoutes);

router.use('/impact', impactRoutes);

export default router;