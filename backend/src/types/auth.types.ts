import { Request } from 'express';
import { Role } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  photoUrl: string | null;
  isActive: boolean;
  isVerified: boolean;
  hasPassword?: boolean;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}