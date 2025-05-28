import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { Token } from '../entities/Token';
import { generateToken } from '../utils/tokenGenerator';
import { sendEmail } from '../utils/emailSender';
import { UserRole } from '../enums/UserRole';
import { RegisterInput, LoginInput, EditUserInput } from '../types/authTypes';

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecret';

export const AuthService = {
  async register({ username, email, password, userRole }: RegisterInput) {
    const userRepository = AppDataSource.getRepository(User);
    const tokenRepository = AppDataSource.getRepository(Token);

    const existing = await userRepository.findOne({ where: { email } });
    if (existing) throw new Error('User already exists');

    if (userRole && !Object.values(UserRole).includes(userRole)) {
      throw new Error('Invalid user role');
    }

    const existingUsername = await userRepository.findOne({ where: { username } });
    if (existingUsername) throw new Error('Username already taken');

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = userRepository.create({
      username,
      email,
      password: hashedPassword,
      isEmailVerified: false,
      userRole: userRole || UserRole.USER,
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
    `;

    await sendEmail(savedUser.email, 'Verify your email', emailHtml);

    return {
      id: savedUser.id,
      username: savedUser.username,
      email: savedUser.email,
      userRole: savedUser.userRole,
    };
  },

  async login({ email, password }: LoginInput) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) throw new Error('User not found');
    if (!user.isEmailVerified) throw new Error('Please verify your email before logging in.');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');

    return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
  },

  async getProfile(requestingUserId: number, requestingUserRole: UserRole, targetId?: number) {
    const userRepository = AppDataSource.getRepository(User);
    const finalUserId = targetId || requestingUserId;

    if (requestingUserRole !== UserRole.ADMIN && finalUserId !== requestingUserId) {
      throw new Error('Unauthorized to access this profile');
    }

    const user = await userRepository.findOne({
      where: { id: finalUserId },
      select: ['id', 'username', 'email', 'created_at', 'userRole'],
    });

    if (!user) throw new Error('User not found');
    return user;
  },

  async verifyEmail(token: string) {
    const tokenRepository = AppDataSource.getRepository(Token);
    const userRepository = AppDataSource.getRepository(User);

    const storedToken = await tokenRepository.findOne({
      where: { token, type: 'email_verification', used: false },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new Error('Token is invalid or has expired');
    }

    const user = await userRepository.findOne({ where: { id: storedToken.userId } });
    if (!user) throw new Error('User not found');

    user.isEmailVerified = true;
    storedToken.used = true;

    await userRepository.save(user);
    await tokenRepository.save(storedToken);
  },

  async forgotPassword(email: string) {
    const userRepository = AppDataSource.getRepository(User);
    const tokenRepository = AppDataSource.getRepository(Token);

    const user = await userRepository.findOne({ where: { email } });
    if (!user) throw new Error('User not found');

    const resetToken = generateToken();
    const tokenEntry = tokenRepository.create({
      userId: user.id,
      token: resetToken,
      type: 'password_reset',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
      used: false,
    });

    await tokenRepository.save(tokenEntry);

    const resetLink = `http://127.0.0.1:4000/api/auth/reset-password?token=${resetToken}`;
    const emailHtml = `
      <h1>Reset Your Password</h1>
      <a href="${resetLink}">Reset Password</a>
    `;

    await sendEmail(user.email, 'Password Reset', emailHtml);
  },

  async resetPassword(token: string, newPassword: string) {
    const tokenRepository = AppDataSource.getRepository(Token);
    const userRepository = AppDataSource.getRepository(User);

    const storedToken = await tokenRepository.findOne({
      where: { token, type: 'password_reset', used: false },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new Error('Token is invalid or has expired');
    }

    const user = await userRepository.findOne({ where: { id: storedToken.userId } });
    if (!user) throw new Error('User not found');

    user.password = await bcrypt.hash(newPassword, 10);
    storedToken.used = true;

    await userRepository.save(user);
    await tokenRepository.save(storedToken);
  },

  async editUser(adminRole: UserRole, targetUserId: number, updates: EditUserInput) {
    if (adminRole !== UserRole.ADMIN) throw new Error('Only admins can edit users');

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: targetUserId } });
    if (!user) throw new Error('User not found');

    const { username, email, newRole } = updates;

    if (username) user.username = username;
    if (email) user.email = email;
    if (newRole && Object.values(UserRole).includes(newRole)) user.userRole = newRole;

    return await userRepository.save(user);
  },

  async deleteUser(adminRole: UserRole, targetUserId: number) {
    if (adminRole !== UserRole.ADMIN) throw new Error('Only admins can delete users');

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: targetUserId } });
    if (!user) throw new Error('User not found');

    await userRepository.remove(user);
  },

  async getAllUsers(adminRole: UserRole) {
    if (adminRole !== UserRole.ADMIN) throw new Error('Only admins can view all users');

    const userRepository = AppDataSource.getRepository(User);
    return await userRepository.find({
      select: ['id', 'username', 'email', 'userRole', 'created_at'],
    });
  },
};
