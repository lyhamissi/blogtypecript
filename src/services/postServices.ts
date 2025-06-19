import { AppDataSource } from '../config/database';
import { Post } from '../entities/Post';
import { User } from '../entities/User';

interface CreatePostDTO {
  title: string;
  summary?: string;
  content?: string;
  image?: string;
  // userId removed since not used for author now
}

interface UpdatePostDTO {
  title?: string;
  summary?: string;
  content?: string;
  image?: string;
}

export const PostService = {
  async createPost({ title, summary, content, image }: CreatePostDTO) {
    const postRepo = AppDataSource.getRepository(Post);

    const post = postRepo.create({
      title,
      summary,
      content,
      image,
      // author field removed since no userId/author now
    });

    return await postRepo.save(post);
  },

  async getAllPosts() {
    const postRepo = AppDataSource.getRepository(Post);
    return await postRepo.find({
      order: { created_at: 'DESC' },
      relations: ['author'], // keep author if you want
    });
  },

  async getPostById(id: number) {
    const postRepo = AppDataSource.getRepository(Post);
    return await postRepo.findOne({
      where: { id },
      relations: ['author'],
    });
  },

  async updatePost(id: number, updates: UpdatePostDTO) {
    const postRepo = AppDataSource.getRepository(Post);
    const post = await postRepo.findOne({ where: { id } });

    if (!post) throw new Error('Post not found');

    Object.assign(post, updates, { updated_at: new Date() });

    return await postRepo.save(post);
  },

  async deletePost(id: number) {
    const postRepo = AppDataSource.getRepository(Post);
    const post = await postRepo.findOne({ where: { id } });

    if (!post) throw new Error('Post not found');

    await postRepo.remove(post);
    return true;
  },
};
