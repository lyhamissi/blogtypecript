
import { UserRole } from '../enums/UserRole';

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  userRole?: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface EditUserInput {
  username?: string;
  email?: string;
  newRole?: UserRole;
}
