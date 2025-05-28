import { Router } from 'express';
import {
  register,
  login,
  getProfile,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getAllUsers,
  editUser,
  deleteUser,
} from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Auth routes for register and login
router.post('/register', register);
router.post('/login', login);

// Protected route for getting a profile of a logged in user
router.get('/profile', authMiddleware, getProfile);

// Email verification 
router.get('/verify-email', verifyEmail);

// Forgot and reset password end-points
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Admin-only routes
router.get('/users', authMiddleware, getAllUsers);
router.put('/users/:id', authMiddleware, editUser);
router.delete('/users/:id', authMiddleware, deleteUser);

export default router;
