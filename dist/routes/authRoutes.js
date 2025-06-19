"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const user_schema_1 = require("../Schema/user.schema");
const multer_1 = __importDefault(require("../middlewares/multer"));
const router = (0, express_1.Router)();
// Auth routes for register and login
router.post('/register', multer_1.default.single('profile_image'), (0, validation_middleware_1.validate)(user_schema_1.createUserSchema), authController_1.register);
router.post('/login', authController_1.login);
// Protected route for getting a profile of a logged in user
router.get('/profile/:id', authMiddleware_1.authMiddleware, authController_1.getProfile);
// Email verification 
router.get('/verify-email', authController_1.verifyEmail);
// Forgot and reset password end-points
router.post('/forgot-password', authController_1.forgotPassword);
router.post('/reset-password', authController_1.resetPassword);
// Admin-only routes
router.get('/users', authMiddleware_1.authMiddleware, authController_1.getAllUsers);
router.put('/users/:id', authMiddleware_1.authMiddleware, authController_1.editUser);
router.delete('/users/:id', authMiddleware_1.authMiddleware, authController_1.deleteUser);
exports.default = router;
