import { Request, Response } from 'express';
import { pool } from '../database';

// Extend Request type to include userId
interface AuthenticatedRequest extends Request {
  userId?: number;
}

export const createPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { title, body } = req.body;
  const userId = req.userId;

  try {
    const result = await pool.query(
      'INSERT INTO posts (title, body, author) VALUES ($1, $2, $3) RETURNING *',
      [title, body, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating post:', err);  // <-- log error to console
    res.status(500).json({ error: 'Failed to create post' });
  }
};


export const getAllPosts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    const post = result.rows[0];
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

  // if (!userId) {
  //   res.status(401).json({ error: 'Unauthorized' });
  //   return;
  // }

  try {
    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    const post = result.rows[0];
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    // if (post.author !== userId) {
    //   res.status(403).json({ error: 'Not authorized' });
    //   return;
    // }

    const updated = await pool.query(
      'UPDATE posts SET title = $1, body = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [title, body, id]
    );
    res.json(updated.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to update post' });
  }
};

export const deletePost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.userId;
// // 
//   if (!userId) {
//     res.status(401).json({ error: 'Unauthorized' });
//     return;
//   }

  try {
    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    const post = result.rows[0];
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    // if (post.author !== userId) {
    //   res.status(403).json({ error: 'Not authorized' });
    //   return;
    // }

    await pool.query('DELETE FROM posts WHERE id = $1', [id]);
    res.json({ message: 'Post deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete post' });
  }
};
