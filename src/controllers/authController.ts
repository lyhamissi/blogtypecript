import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../database';
import { User } from '../entities/User';
import { Token } from '../entities/Token';
import { generateToken } from '../utils/tokenGenerator';
import { sendEmail } from '../utils/emailSender';
import { UserRole } from '../enums/UserRole';

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecret';

//Register logic 
export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password, userRole } = req.body;

  try {
    const userRepository = AppDataSource.getRepository(User);
    const tokenRepository = AppDataSource.getRepository(Token);

    const existing = await userRepository.findOne({ where: { email } });
    if (existing) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }
    if (userRole && !Object.values(UserRole).includes(userRole)) {
      res.status(400).json({ error: 'Invalid user role' });
      return;
    }
    const existingUsername = await userRepository.findOne({ where: { username } });
    if (existingUsername) {
      res.status(400).json({ error: 'Username alread y taken' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = userRepository.create({
      username,
      email,
      password: hashedPassword,
      isEmailVerified: false,
      userRole: userRole || UserRole.USER, // default to 'user' if not provided
    });


    const savedUser = await userRepository.save(newUser);

    const verificationToken = generateToken();
    const tokenEntity = tokenRepository.create({
      userId: savedUser.id,
      token: verificationToken,
      type: 'email_verification',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      used: false,
    });

    await tokenRepository.save(tokenEntity);

    const verificationLink = `http://127.0.0.1:4000/api/auth/verify-email?token=${verificationToken}`;
    const emailHtml = `
      <h1>Email Verification</h1>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `;

    await sendEmail(savedUser.email, 'Verify your email', emailHtml);

    res.status(201).json({
      message: 'User registered. Verification email sent.',
      user: { id: savedUser.id, username: savedUser.username, email: savedUser.email, userRole: savedUser.userRole },
    });
  }
   catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

//  Login
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (!user.isEmailVerified) {
      res.status(403).json({ error: 'Please verify your email before logging in.' });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

//  Get Profile
//  Get Profile (supports admin viewing others)
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  const { userId, userRole } = (req as any).user || {};

  // `admin` can fetch any user by ID (query param), `user` can only fetch their own
  const targetUserId = req.query.userId ? parseInt(req.query.userId as string) : userId;

  if (!targetUserId) {
    res.status(400).json({ error: 'User ID missing or invalid' });
    return;
  }

  // Deny if user is not admin and tries to access another user's profile
  if (userRole !== UserRole.ADMIN && targetUserId !== userId) {
    res.status(403).json({ error: 'Unauthorized to access this profile' });
    return;
  }

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: targetUserId },
      select: ['id', 'username', 'email', 'created_at', 'userRole'],
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (err) {
    console.error('GetProfile Error:', err);
    res.status(500).json({ error: 'Could not fetch profile details' });
  }
};


//  Verify Email
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    res.status(400).json({ error: 'Invalid token' });
    return;
  }

  const tokenRepository = AppDataSource.getRepository(Token);
  const userRepository = AppDataSource.getRepository(User);

  const storedToken = await tokenRepository.findOne({ where: { token, type: 'email_verification', used: false } });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    res.status(400).json({ error: 'Token is invalid or has expired' });
    return;
  }

  const user = await userRepository.findOne({ where: { id: storedToken.userId } });
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  user.isEmailVerified = true;
  await userRepository.save(user);

  storedToken.used = true;
  await tokenRepository.save(storedToken);

  res.json({ message: 'Email verified successfully' });
};

//  Forgot Password
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  const userRepository = AppDataSource.getRepository(User);
  const tokenRepository = AppDataSource.getRepository(Token);

  const user = await userRepository.findOne({ where: { email } });
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const resetToken = generateToken();
  const tokenEntry = tokenRepository.create({
    userId: user.id,
    token: resetToken,
    type: 'password_reset',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
    used: false,
  });

  await tokenRepository.save(tokenEntry);

  const resetLink = `http://127.0.0.1:4000/api/auth/reset-password?token=${resetToken}`;
  const emailHtml = `
    <h1>Reset Your Password</h1>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}">Reset Password</a>
    <p>This link will expire in 1 hour.</p>
  `;

  await sendEmail(user.email, 'Password Reset', emailHtml);

  res.json({ message: 'Password reset link sent to email' });
};

//  Reset Password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token, newPassword } = req.body;

  const tokenRepository = AppDataSource.getRepository(Token);
  const userRepository = AppDataSource.getRepository(User);

  const storedToken = await tokenRepository.findOne({ where: { token, type: 'password_reset', used: false } });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    res.status(400).json({ error: 'Token is invalid or has expired' });
    return;
  }

  const user = await userRepository.findOne({ where: { id: storedToken.userId } });
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await userRepository.save(user);

  storedToken.used = true;
  await tokenRepository.save(storedToken);

  res.json({ message: 'Password reset successful' });
};


// Edit a user by admin
export const editUser = async (req: Request, res: Response): Promise<void> => {
  const { userId, userRole } = (req as any).user;

  // Only admin can edit users
  if (userRole !== UserRole.ADMIN) {
    res.status(403).json({ error: 'Only admins can edit users' });
    return;
  }

  const targetUserId = parseInt(req.params.id);
  const { username, email, userRole: newRole } = req.body;

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: targetUserId } });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Update user fields if provided
    if (username) user.username = username;
    if (email) user.email = email;
    if (newRole && Object.values(UserRole).includes(newRole)) {
      user.userRole = newRole;
    }

    const updatedUser = await userRepository.save(user);
    res.json({
      message: 'User updated successfully',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        userRole: updatedUser.userRole,
      },
    });
  } catch (err) {
    console.error('Edit User Error:', err);
    res.status(500).json({ error: 'Could not update user' });
  }
};

// Delete a user by admin
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { userId, userRole } = (req as any).user;

  // Only admin can delete users
  if (userRole !== UserRole.ADMIN) {
    res.status(403).json({ error: 'Only admins can delete users' });
    return;
  }

  const targetUserId = parseInt(req.params.id);

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: targetUserId } });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    await userRepository.remove(user);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete User Error:', err);
    res.status(500).json({ error: 'Could not delete user' });
  }
};

// Get All Users (Admin Only)
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId;

  try {
    const userRepository = AppDataSource.getRepository(User);

    // Check if the current user is an admin
    const currentUser = await userRepository.findOne({ where: { id: userId } });
    if (!currentUser || currentUser.userRole !== UserRole.ADMIN) {
      res.status(403).json({ error: 'Access denied. Admins only.' });
      return;
    }

    // Retrieve all users excluding sensitive data like password
    const users = await userRepository.find({
      select: ['id', 'username', 'email', 'userRole', 'isEmailVerified', 'created_at'],
    });

    res.json({ users });
  } catch (err) {
    console.error('GetAllUsers Error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

