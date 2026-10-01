import { Router } from 'express';
import { login, logout, me, refresh, forgotPassword, resetPassword, signup, verifyEmail, resendVerificationEmail } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { authLimiter, strictAuthLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.post('/signup', strictAuthLimiter, signup);
router.get('/verify-email/:token', strictAuthLimiter, verifyEmail);
router.post('/resend-verification', strictAuthLimiter, resendVerificationEmail);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.post('/refresh', authLimiter, refresh);
router.post('/forgot-password', strictAuthLimiter, forgotPassword);
router.post('/reset-password', strictAuthLimiter, resetPassword);
router.get('/me', requireAuth, me);

export default router;
