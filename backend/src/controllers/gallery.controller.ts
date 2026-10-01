import { Request, Response, NextFunction } from 'express';
import { galleryService } from '../services/gallery.service';
import { cloudinaryService } from '../services/cloudinary.service';
import { CreateGalleryInput, UpdateGalleryInput, GalleryQueryInput } from '../validators/gallery.validator';
import { AppError } from '../errors/AppError';

export const listGallery = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query as unknown as GalleryQueryInput;
    const isPublicRequest = true; // GET endpoints are strictly public as per requirements
    const result = await galleryService.listGalleryItems(query, isPublicRequest);
    
    res.json({
      success: true,
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    next(error);
  }
};

export const getGalleryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const isPublicRequest = true; // GET endpoints are strictly public
    const item = await galleryService.getGalleryItemById(id, isPublicRequest);
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const createGallery = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = req.body as CreateGalleryInput;
    
    if (!req.file) {
      throw new AppError('Image file is required', 400);
    }

    const uploadResult = await cloudinaryService.uploadImage(req.file.buffer);

    try {
      // Explicitly construct the service input from validated fields as required by instructions
      const serviceInput: CreateGalleryInput = {
        title: data.title,
        description: data.description,
        imageUrl: uploadResult.secure_url,
        cloudinaryPublicId: uploadResult.public_id,
        category: data.category,
        eventDate: data.eventDate,
        isFeatured: data.isFeatured ?? false,
        isPublished: data.isPublished ?? false
      };

      const item = await galleryService.createGalleryItem(serviceInput);
      
      res.status(201).json({
        success: true,
        data: item
      });
    } catch (dbError) {
      await cloudinaryService.deleteImage(uploadResult.public_id);
      throw dbError;
    }
  } catch (error) {
    next(error);
  }
};

export const updateGallery = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const data = req.body as UpdateGalleryInput;
    
    const existingItem = await galleryService.getGalleryItemById(id, false);

    let newImageUrl = data.imageUrl;
    let newPublicId = data.cloudinaryPublicId;
    let uploadResult;

    if (req.file) {
      uploadResult = await cloudinaryService.uploadImage(req.file.buffer);
      newImageUrl = uploadResult.secure_url;
      newPublicId = uploadResult.public_id;
    }
    
    try {
      // Explicitly construct the service input from validated fields
      const serviceInput: UpdateGalleryInput = {
        title: data.title,
        description: data.description,
        imageUrl: newImageUrl,
        cloudinaryPublicId: newPublicId,
        category: data.category,
        eventDate: data.eventDate,
        isFeatured: data.isFeatured,
        isPublished: data.isPublished
      };

      const item = await galleryService.updateGalleryItem(id, serviceInput);
      
      if (req.file && (existingItem as any).cloudinaryPublicId) {
        try {
          await cloudinaryService.deleteImage((existingItem as any).cloudinaryPublicId);
        } catch (cleanupError) {
          console.error('Failed to cleanup old Cloudinary image:', cleanupError);
        }
      }

      res.json({
        success: true,
        data: item
      });
    } catch (dbError) {
      if (uploadResult) {
        await cloudinaryService.deleteImage(uploadResult.public_id);
      }
      throw dbError;
    }
  } catch (error) {
    next(error);
  }
};

export const deleteGallery = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    
    const existingItem = await galleryService.getGalleryItemById(id, false);

    await galleryService.deleteGalleryItem(id);
    
    if ((existingItem as any).cloudinaryPublicId) {
      try {
        await cloudinaryService.deleteImage((existingItem as any).cloudinaryPublicId);
      } catch (cleanupError) {
        console.error('Failed to cleanup Cloudinary image after DB deletion:', cleanupError);
      }
    }

    res.json({
      success: true,
      message: 'Gallery item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
