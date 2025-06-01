import { NextFunction, Request, RequestHandler, Response } from 'express';
import { AuthService } from '../services/authServices';
import { asyncHandler } from '../middlewares/errorHandler';
import { ApiResponse, AuthenticatedRequest } from '../types/common.types';
import { CreateUserInput } from '../Schema/user.schema';
// export const register = async (req: Request, res: Response) => {
//   try {
//     const user = await AuthService.register(req.body);
//     res.status(201).json({ message: 'User registered. Verification email sent.', user });
//   } catch (err: any) {
//     res.status(400).json({ error: err.message });
//   }
// };
export const register = asyncHandler(async (
  req: AuthenticatedRequest & CreateUserInput,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  try {
    console.log('Incoming Register Request:', req.body);
    const user = await AuthService.register(req.body);
    res.status(201).json({
      success: true,
      message: 'User registered successfully. Verification E-mail sent.',
      data: {
        user: {
          id: user.id,
          name: user.username,
          email: user.email,
          role: user.userRole
        }
      }
    })
  }
  catch (err) {
    console.error('Registration error:', err);
    next(err);
  }

  }) as RequestHandler;
export const login = async (req: Request, res: Response) => {
  try {
    const token = await AuthService.login(req.body);
    res.json({ token });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { id: userId, userRole } = (req as any).user || {};
    const targetId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
    const user = await AuthService.getProfile(userId, userRole, targetId);
    res.json(user);
  } catch (err: any) {
    res.status(403).json({ error: err.message });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const token = req.query.token as string;
    await AuthService.verifyEmail(token);
    res.json({ message: 'Email verified successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    await AuthService.forgotPassword(req.body.email);
    res.json({ message: 'Password reset link sent to email' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    await AuthService.resetPassword(token, newPassword);
    res.json({ message: 'Password reset successful' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const editUser = async (req: Request, res: Response) => {
  try {
    const { userId, userRole } = (req as any).user;
    const updatedUser = await AuthService.editUser(userRole, parseInt(req.params.id), req.body);
    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId, userRole } = (req as any).user;
    await AuthService.deleteUser(userRole, parseInt(req.params.id));
    res.json({ message: 'User deleted successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { userRole } = (req as any).user;
    const users = await AuthService.getAllUsers(userRole);
    res.json(users);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
