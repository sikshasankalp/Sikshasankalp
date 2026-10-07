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
  firstName?: string | null;
  lastName?: string | null;
  hasPassword?: boolean;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}