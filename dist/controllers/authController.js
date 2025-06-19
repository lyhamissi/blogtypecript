import { AuthService } from '../services/authServices';
import { asyncHandler } from '../middlewares/errorHandler';
// export const register = async (req: Request, res: Response) => {
//   try {
//     const user = await AuthService.register(req.body);
//     res.status(201).json({ message: 'User registered. Verification email sent.', user });
//   } catch (err: any) {
//     res.status(400).json({ error: err.message });
//   }
// };
export const register = asyncHandler(async (req, res, next) => {
    try {
        console.log('Incoming Register Request:', req.body);
        const profile_image = req.file?.filename;
        const userData = {
            ...req.body,
            profile_image,
        };
        const user = await AuthService.register(userData);
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
});
export const login = async (req, res) => {
    try {
        const { token, user } = await AuthService.login(req.body);
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
};
export const getProfile = async (req, res) => {
    try {
        const { id: userId, userRole } = req.user || {};
        const targetId = req.query.userId ? parseInt(req.query.userId) : undefined;
        const user = await AuthService.getProfile(userId, userRole, targetId);
        res.json(user);
    }
    catch (err) {
        res.status(403).json({ error: err.message });
    }
};
export const verifyEmail = async (req, res) => {
    try {
        const token = req.query.token;
        await AuthService.verifyEmail(token);
        res.json({ message: 'Email verified successfully' });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
export const forgotPassword = async (req, res) => {
    try {
        await AuthService.forgotPassword(req.body.email);
        res.json({ message: 'Password reset link sent to email' });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        await AuthService.resetPassword(token, newPassword);
        res.json({ message: 'Password reset successful' });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
export const editUser = async (req, res) => {
    try {
        const { userId, userRole } = req.user;
        const updatedUser = await AuthService.editUser(userRole, parseInt(req.params.id), req.body);
        res.json({ message: 'User updated successfully', user: updatedUser });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
export const deleteUser = async (req, res) => {
    try {
        const { userId, userRole } = req.user;
        await AuthService.deleteUser(userRole, parseInt(req.params.id));
        res.json({ message: 'User deleted successfully' });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
export const getAllUsers = async (req, res) => {
    try {
        const { userRole } = req.user;
        const users = await AuthService.getAllUsers(userRole);
        res.json(users);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
