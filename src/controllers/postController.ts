// src/controllers/postController.ts

import { Request, Response } from 'express';
import { AppDataSource } from '../database';
import { Post } from '../entities/Post';

// Extend Request type to include userId
interface AuthenticatedRequest extends Request {
  userId?: number;
}

const postRepository = AppDataSource.getRepository(Post);

export const createPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { title, body } = req.body;
  const userId = req.userId;

  try {
    const newPost = postRepository.create({ title, body, author: userId! });
    const savedPost = await postRepository.save(newPost);
    res.status(201).json(savedPost);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

export const getAllPosts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const posts = await postRepository.find({ order: { created_at: 'DESC' } });
    res.json(posts);
  } catch {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const post = await postRepository.findOneBy({ id: Number(id) });
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    res.json(post);
  } catch {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

export const updatePost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, body } = req.body;
  const userId = req.userId;

  try {
    const post = await postRepository.findOneBy({ id: Number(id) });
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    if (post.author !== userId) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    post.title = title;
    post.body = body;
    post.updated_at = new Date();

    const updatedPost = await postRepository.save(post);
    res.json(updatedPost);
  } catch {
    res.status(500).json({ error: 'Failed to update post' });
  }
};

export const deletePost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const post = await postRepository.findOneBy({ id: Number(id) });
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    if (post.author !== userId) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    await postRepository.remove(post);
    res.json({ message: 'Post deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete post' });
  }
};
