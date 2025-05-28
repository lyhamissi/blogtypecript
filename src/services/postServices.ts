import { AppDataSource } from '../database';
import { Post } from '../entities/Post';

export const PostService = {
  async createPost({ title, body, userId }: { title: string; body: string; userId: number }) {
    const postRepo = AppDataSource.getRepository(Post);
    const post = postRepo.create({ title, body, author:{id: userId}, });
    return await postRepo.save(post);
  },

  async getAllPosts() {
    const postRepo = AppDataSource.getRepository(Post);
    return await postRepo.find({ order: { created_at: 'DESC' } });
  },

  async getPostById(id: number) {
    const postRepo = AppDataSource.getRepository(Post);
    return await postRepo.findOneBy({ id });
  },

  async updatePost(id: number, { title, body }: { title: string; body: string }, userId: number) {
    const postRepo = AppDataSource.getRepository(Post);
    const post = await postRepo.findOneBy({ id });
    if (!post) throw new Error('Post not found');
    if (post.author.id !== userId) throw new Error('Not authorized');

    post.title = title;
    post.body = body;
    post.updated_at = new Date();

    return await postRepo.save(post);
  },

  async deletePost(id: number, userId: number) {
    const postRepo = AppDataSource.getRepository(Post);
    const post = await postRepo.findOneBy({ id });
    if (!post) throw new Error('Post not found');
    if (post.author.id !== userId) throw new Error('Not authorized');

    await postRepo.remove(post);
  },
};
