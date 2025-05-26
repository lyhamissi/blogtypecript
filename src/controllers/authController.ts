import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../database';
import { User } from '../entities/User';
import { Token } from '../entities/Token';
import { generateToken } from '../utils/tokenGenerator';
import { sendEmail } from '../utils/emailSender';

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecret';

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

    // Create new user with isEmailVerified = false
    const newUser = userRepository.create({
      username,
      email,
      password: hashedPassword,
      isEmailVerified: false,
    });

    const savedUser = await userRepository.save(newUser);

    // Generate email verification token
    const verificationToken = generateToken();

    const tokenEntity = tokenRepository.create({
      userId: savedUser.id,
      token: verificationToken,
      type: 'email_verification',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // expires in 24 hours
      used: false,
    });

    await tokenRepository.save(tokenEntity);

    // Send verification email
    const verificationLink = `http://your-frontend-url.com/verify-email?token=${verificationToken}`;

    const emailHtml = `
      <h1>Email Verification</h1>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `;

    await sendEmail(savedUser.email, 'Verify your email', emailHtml);

    // Optionally don't send JWT token until email is verified
    res.status(201).json({
      message: 'User registered. Verification email sent.',
      user: { id: savedUser.id, username: savedUser.username, email: savedUser.email },
    });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Block login if email is not verified
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
