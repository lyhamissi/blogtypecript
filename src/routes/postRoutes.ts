import { Router } from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from '../controllers/postController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/posts', getAllPosts);
router.get('/posts/:id', getPostById);
router.post('/posts', authMiddleware, createPost);
router.put('/posts/:id', updatePost);
router.delete('/posts/:id',authMiddleware, deletePost);

export default router;
