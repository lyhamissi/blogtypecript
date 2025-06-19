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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.deleteUser = exports.editUser = exports.resetPassword = exports.forgotPassword = exports.verifyEmail = exports.getProfile = exports.login = exports.register = void 0;
const authServices_1 = require("../services/authServices");
const errorHandler_1 = require("../middlewares/errorHandler");
// export const register = async (req: Request, res: Response) => {
//   try {
//     const user = await AuthService.register(req.body);
//     res.status(201).json({ message: 'User registered. Verification email sent.', user });
//   } catch (err: any) {
//     res.status(400).json({ error: err.message });
//   }
// };
exports.register = (0, errorHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log('Incoming Register Request:', req.body);
        const profile_image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
        const userData = Object.assign(Object.assign({}, req.body), { profile_image });
        const user = yield authServices_1.AuthService.register(userData);
        res.status(201).json({
            success: true,
            code: 201,
            message: 'User registered successfully. Verification E-mail sent.',
            data: {
                user: {
                    id: user.id,
                    name: user.username,
                    email: user.email,
                    role: user.userRole,
                    profile_image: user.profile_image,
                },
            },
        });
    }
    catch (err) {
        console.error('Registration error:', err);
        next(err);
    }
}));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, user } = yield authServices_1.AuthService.login(req.body);
        res.json({
            success: true,
            code: 200,
            message: "Login successfully",
            token,
            user,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            code: 400,
            message: err.message,
        });
    }
});
exports.login = login;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userId, userRole } = req.user || {};
        const targetId = req.query.userId ? parseInt(req.query.userId) : undefined;
        const user = yield authServices_1.AuthService.getProfile(userId, userRole, targetId);
        res.json(user);
    }
    catch (err) {
        res.status(403).json({ error: err.message });
    }
});
exports.getProfile = getProfile;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.query.token;
        yield authServices_1.AuthService.verifyEmail(token);
        res.json({ message: 'Email verified successfully' });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.verifyEmail = verifyEmail;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield authServices_1.AuthService.forgotPassword(req.body.email);
        res.json({ message: 'Password reset link sent to email' });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, newPassword } = req.body;
        yield authServices_1.AuthService.resetPassword(token, newPassword);
        res.json({ message: 'Password reset successful' });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.resetPassword = resetPassword;
const editUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, userRole } = req.user;
        const updatedUser = yield authServices_1.AuthService.editUser(userRole, parseInt(req.params.id), req.body);
        res.json({ message: 'User updated successfully', user: updatedUser });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.editUser = editUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, userRole } = req.user;
        yield authServices_1.AuthService.deleteUser(userRole, parseInt(req.params.id));
        res.json({ message: 'User deleted successfully' });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.deleteUser = deleteUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userRole } = req.user;
        const users = yield authServices_1.AuthService.getAllUsers(userRole);
        res.json(users);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.getAllUsers = getAllUsers;
