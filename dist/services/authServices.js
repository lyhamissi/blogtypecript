"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const User_1 = require("../entities/User");
const Token_1 = require("../entities/Token");
const tokenGenerator_1 = require("../utils/tokenGenerator");
const emailSender_1 = require("../utils/emailSender");
const UserRole_1 = require("../enums/UserRole");
const JWT_SECRET = process.env.JWT_SECRET || 'lyhamissi';
exports.AuthService = {
    register(_a) {
        return __awaiter(this, arguments, void 0, function* ({ username, email, password, userRole, profile_image }) {
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const tokenRepository = database_1.AppDataSource.getRepository(Token_1.Token);
            const existing = yield userRepository.findOne({ where: { email } });
            if (existing)
                throw new Error('User already exists');
            if (userRole && !Object.values(UserRole_1.UserRole).includes(userRole)) {
                throw new Error('Invalid user role');
            }
            const existingUsername = yield userRepository.findOne({ where: { username } });
            if (existingUsername)
                throw new Error('Username already taken');
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            const newUser = userRepository.create({
                username,
                email,
                password: hashedPassword,
                isEmailVerified: false,
                userRole: userRole || UserRole_1.UserRole.USER,
                profile_image: profile_image || null,
            });
            const savedUser = yield userRepository.save(newUser);
            const verificationToken = (0, tokenGenerator_1.generateToken)();
            const tokenEntity = tokenRepository.create({
                userId: savedUser.id,
                token: verificationToken,
                type: 'email_verification',
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
                used: false,
            });
            yield tokenRepository.save(tokenEntity);
            const verificationLink = `http://127.0.0.1:4000/api/auth/verify-email?token=${verificationToken}`;
            const emailHtml = `
    <h1>Email Verification</h1>
    <p>Please verify your email by clicking the link below:</p>
    <a href="${verificationLink}">Verify Email</a>
  `;
            yield (0, emailSender_1.sendEmail)(savedUser.email, 'Verify your email', emailHtml);
            return {
                id: savedUser.id,
                username: savedUser.username,
                email: savedUser.email,
                userRole: savedUser.userRole,
                profile_image: savedUser.profile_image,
            };
        });
    },
    login(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password }) {
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const tokenRepository = database_1.AppDataSource.getRepository(Token_1.Token);
            const user = yield userRepository
                .createQueryBuilder('user')
                .addSelect('user.password')
                .where('user.email = :email', { email })
                .getOne();
            if (!user)
                throw new Error('User not found');
            if (!user.isEmailVerified)
                throw new Error('Please verify your email before logging in.');
            const valid = yield bcryptjs_1.default.compare(password, user.password);
            if (!valid)
                throw new Error('Invalid credentials');
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
            const tokenEntity = tokenRepository.create({
                userId: user.id,
                token,
                type: 'login',
                expiresAt: new Date(Date.now() + 1000 * 60 * 60),
                used: false,
            });
            yield tokenRepository.save(tokenEntity);
            return {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    role: user.userRole,
                }
            };
        });
    },
    getProfile(requestingUserId, requestingUserRole, targetId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const finalUserId = targetId || requestingUserId;
            if (requestingUserRole !== UserRole_1.UserRole.ADMIN && finalUserId !== requestingUserId) {
                throw new Error('Unauthorized to access this profile');
            }
            const user = yield userRepository.findOne({
                where: { id: finalUserId },
                select: ['id', 'username', 'email', 'created_at', 'userRole'],
            });
            if (!user)
                throw new Error('User not found');
            return user;
        });
    },
    verifyEmail(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenRepository = database_1.AppDataSource.getRepository(Token_1.Token);
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const storedToken = yield tokenRepository.findOne({
                where: { token, type: 'email_verification', used: false },
            });
            if (!storedToken || storedToken.expiresAt < new Date()) {
                throw new Error('Token is invalid or has expired');
            }
            const user = yield userRepository.findOne({ where: { id: storedToken.userId } });
            if (!user)
                throw new Error('User not found');
            user.isEmailVerified = true;
            storedToken.used = true;
            yield userRepository.save(user);
            yield tokenRepository.save(storedToken);
        });
    },
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const tokenRepository = database_1.AppDataSource.getRepository(Token_1.Token);
            const user = yield userRepository.findOne({ where: { email } });
            if (!user)
                throw new Error('User not found');
            const resetToken = (0, tokenGenerator_1.generateToken)();
            const tokenEntry = tokenRepository.create({
                userId: user.id,
                token: resetToken,
                type: 'password_reset',
                expiresAt: new Date(Date.now() + 1000 * 60 * 60),
                used: false,
            });
            yield tokenRepository.save(tokenEntry);
            const resetLink = `http://127.0.0.1:4000/api/auth/reset-password?token=${resetToken}`;
            const emailHtml = `
      <h1>Reset Your Password</h1>
     <h3>Click the link to reset your password</h3>
      <a href="${resetLink}">Reset Password</a>
    `;
            yield (0, emailSender_1.sendEmail)(user.email, 'Password Reset', emailHtml);
        });
    },
    resetPassword(token, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenRepository = database_1.AppDataSource.getRepository(Token_1.Token);
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const storedToken = yield tokenRepository.findOne({
                where: { token, type: 'password_reset', used: false },
            });
            if (!storedToken || storedToken.expiresAt < new Date()) {
                throw new Error('Token is invalid or has expired');
            }
            const user = yield userRepository.findOne({ where: { id: storedToken.userId } });
            if (!user)
                throw new Error('User not found');
            user.password = yield bcryptjs_1.default.hash(newPassword, 10);
            storedToken.used = true;
            yield userRepository.save(user);
            yield tokenRepository.save(storedToken);
        });
    },
    editUser(adminRole, targetUserId, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            if (adminRole !== UserRole_1.UserRole.ADMIN)
                throw new Error('Only admins can edit users');
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const user = yield userRepository.findOne({ where: { id: targetUserId } });
            if (!user)
                throw new Error('User not found');
            const { username, email, newRole } = updates;
            if (username)
                user.username = username;
            if (email)
                user.email = email;
            if (newRole && Object.values(UserRole_1.UserRole).includes(newRole))
                user.userRole = newRole;
            return yield userRepository.save(user);
        });
    },
    deleteUser(adminRole, targetUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (adminRole !== UserRole_1.UserRole.ADMIN)
                throw new Error('Only admins can delete users');
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const user = yield userRepository.findOne({ where: { id: targetUserId } });
            if (!user)
                throw new Error('User not found');
            yield userRepository.remove(user);
        });
    },
    getAllUsers(adminRole) {
        return __awaiter(this, void 0, void 0, function* () {
            if (adminRole !== UserRole_1.UserRole.ADMIN)
                throw new Error('Only admins can view all users');
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            return yield userRepository.find({
                select: ['id', 'username', 'email', 'userRole', 'created_at'],
            });
        });
    },
};
