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
exports.authorize = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database"); // adjust path if needed
const User_1 = require("../entities/User");
const secret = process.env.JWT_SECRET;
if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: 'Authorization header missing' });
        return;
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        res.status(401).json({ error: 'Authorization header malformed' });
        return;
    }
    const token = parts[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = yield userRepository.findOne({ where: { id: decoded.userId } });
        if (!user) {
            res.status(401).json({ error: 'User not found' });
            return;
        }
        req.user = user; // Attach full user object to the request
        next();
    }
    catch (err) {
        console.error('JWT verification failed:', err);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});
exports.authMiddleware = authMiddleware;
// Role-based authorization middleware
const authorize = (roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !roles.includes(user.userRole)) {
            return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
        }
        next();
    };
};
exports.authorize = authorize;
