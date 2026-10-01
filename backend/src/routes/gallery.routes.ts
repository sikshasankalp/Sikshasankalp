import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { 
  createGallerySchema, 
  updateGallerySchema, 
  galleryIdSchema, 
  galleryQuerySchema 
} from '../validators/gallery.validator';
import { AppError } from '../errors/AppError';
import { ZodSchema } from 'zod';

const router = Router();

// Inline validators for query and params
const validateQuery = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction): void => {
  const result = schema.safeParse(req.query);
  if (!result.success) {
    next(new AppError('Invalid query parameters', 400));
    return;
  }
  Object.assign(req.query, result.data);
  next();
};

const validateParams = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction): void => {
  const result = schema.safeParse(req.params);
  if (!result.success) {
    next(new AppError('Invalid request parameters', 400));
    return;
  }
  Object.assign(req.params, result.data);
  next();
};

// Placeholder controllers
const getGalleryPlaceholder = (req: Request, res: Response) => { res.json({ success: true }); };
const getGalleryItemPlaceholder = (req: Request, res: Response) => { res.json({ success: true }); };
const createGalleryPlaceholder = (req: Request, res: Response) => { res.json({ success: true }); };
const updateGalleryPlaceholder = (req: Request, res: Response) => { res.json({ success: true }); };
const deleteGalleryPlaceholder = (req: Request, res: Response) => { res.json({ success: true }); };

// Public GET
router.get('/', validateQuery(galleryQuerySchema), getGalleryPlaceholder);
router.get('/:id', validateParams(galleryIdSchema), getGalleryItemPlaceholder);

// Admin WRITE
router.post(
  '/',
  requireAuth,
  requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'),
  validateBody(createGallerySchema),
  createGalleryPlaceholder
);

router.patch(
  '/:id',
  requireAuth,
  requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'),
  validateParams(galleryIdSchema),
  validateBody(updateGallerySchema),
  updateGalleryPlaceholder
);

router.delete(
  '/:id',
  requireAuth,
  requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'),
  validateParams(galleryIdSchema),
  deleteGalleryPlaceholder
);

export default router;
