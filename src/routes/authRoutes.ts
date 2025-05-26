import { Router } from 'express';
import { register, login, profile } from '../controllers/authController';
import { getProfile } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, profile);
router.get('/profile/details', authMiddleware, getProfile);

export default router;
