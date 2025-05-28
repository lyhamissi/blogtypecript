import { Request } from 'express';
import { User } from '../entities/User';


export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
}

export type UserRole = 'USER' | 'ADMIN';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}