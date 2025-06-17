import { Request } from 'express';
import { User } from '../entities/User';


export interface AuthenticatedRequest extends Request {
  user?: User;
   file?: Express.Multer.File;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
}

export type UserRole = 'USER' | 'ADMIN'|'SUPERADMIN';

export interface ApiResponse<T = any> {
  success: boolean;
  code: number;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}