import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../database';
import { User } from '../entities/User';
import { Token } from '../entities/Token';
import { generateToken } from '../utils/tokenGenerator';
import { sendEmail } from '../utils/emailSender';

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecret';

//Register logic 
export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    const userRepository = AppDataSource.getRepository(User);
    const tokenRepository = AppDataSource.getRepository(Token);

    const existing = await userRepository.findOne({ where: { email } });
    if (existing) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = userRepository.create({
      username,
      email,
      password: hashedPassword,
      isEmailVerified: false,
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
      user: { id: savedUser.id, username: savedUser.username, email: savedUser.email },
    });
  } catch (err) {
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
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId;

  if (!userId) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: userId },
      select: ['id', 'username', 'email', 'created_at'],
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
