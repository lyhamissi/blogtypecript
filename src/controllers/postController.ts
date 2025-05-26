// src/controllers/postController.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../database';
import { Post } from '../entities/Post';

export const createPost = async (req: Request, res: Response): Promise<void> => {
  const { title, body } = req.body;
  const userId = (req as any).userId;

  try {
    const postRepo = AppDataSource.getRepository(Post);
    const post = postRepo.create({ title, body, author: userId });
    const savedPost = await postRepo.save(post);
    res.status(201).json(savedPost);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

export const getAllPosts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const posts = await AppDataSource.getRepository(Post).find({
      order: { created_at: 'DESC' },
    });
    res.json(posts);
  } catch {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const post = await AppDataSource.getRepository(Post).findOneBy({ id: Number(id) });
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    res.json(post);
  } catch {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

export const updatePost = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, body } = req.body;
  const userId = (req as any).userId;

  try {
    const postRepo = AppDataSource.getRepository(Post);
    const post = await postRepo.findOneBy({ id: Number(id) });

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

    const updatedPost = await postRepo.save(post);
    res.json(updatedPost);
  } catch {
    res.status(500).json({ error: 'Failed to update post' });
  }
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = (req as any).userId;

  try {
    const postRepo = AppDataSource.getRepository(Post);
    const post = await postRepo.findOneBy({ id: Number(id) });

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    if (post.author !== userId) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    await postRepo.remove(post);
    res.json({ message: 'Post deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete post' });
  }
};
