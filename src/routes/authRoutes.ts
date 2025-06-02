/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Logs in a user and returns a JWT token.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: yourpassword
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Login successfully
 *                 token:
 *                   type: string
 *                   example: your.jwt.token.here
 *       400:
 *         description: Invalid credentials or other login failure
 */

//register swagger comments 
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account and returns a success message.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - userRole
 *             properties:
 *               username:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: yourSecurePassword123
 *               userRole:
 *                 type: string
 *                 example: ADMIN
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 code:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *       400:
 *         description: Registration failed due to validation or duplicate email
 */

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
import { validate } from '../middlewares/validation.middleware';
import { createUserSchema } from '../Schema/user.schema';

const router = Router();

// Auth routes for register and login
router.post('/register',validate(createUserSchema), register);
router.post('/login', login);

// Protected route for getting a profile of a logged in user
router.get('/profile/:id', authMiddleware, getProfile);

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
