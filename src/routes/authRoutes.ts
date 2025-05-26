import { Router } from 'express';
import {
  register,
  login,
  getProfile,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);

// Protected route
router.get('/profile', authMiddleware, getProfile);

// Email verification
router.get('/verify-email', verifyEmail);

// Forgot and reset password
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
