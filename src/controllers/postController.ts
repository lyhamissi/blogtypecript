import { Request, Response } from 'express';
import { PostService } from '../services/postServices';

export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, summary, content, image } = req.body;

    const savedPost = await PostService.createPost({
      title,
      summary,
      content,
      image,
    });

    res.status(201).json(savedPost);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({
      error: err instanceof Error ? err.message : 'Failed to create post',
    });
  }
};

export const getAllPosts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const posts = await PostService.getAllPosts();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const post = await PostService.getPostById(Number(id));
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

export const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, summary, content, image } = req.body;

    const updatedPost = await PostService.updatePost(Number(id), {
      title,
      summary,
      content,
      image,
    });

    res.json(updatedPost);
  } catch (err) {
    if (err instanceof Error && err.message === 'Post not found') {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Failed to update post' });
    }
  }
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await PostService.deletePost(Number(id));
    res.json({ message: 'Post deleted' });
  } catch (err) {
    if (err instanceof Error && err.message === 'Post not found') {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Failed to delete post' });
    }
  }
};
