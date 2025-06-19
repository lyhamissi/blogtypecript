import { AppDataSource } from '../config/database';
import { Post } from '../entities/Post';
import { User } from '../entities/User';

interface CreatePostDTO {
  title: string;
  summary?: string;
  content?: string;
  image?: string;
  userId: number;
}

interface UpdatePostDTO {
  title?: string;
  summary?: string;
  content?: string;
  image?: string;
}

export const PostService = {
  async createPost({ title, summary, content, image, userId }: CreatePostDTO) {
    const postRepo = AppDataSource.getRepository(Post);
    const userRepo = AppDataSource.getRepository(User);

    // const author = await userRepo.findOneBy({ id: userId });
    // if (!author) {
    //   throw new Error('User not found');
    // }

    const post = postRepo.create({
      title,
      summary,
      content,
      image,
    });

    return await postRepo.save(post);
  },

  async getAllPosts() {
    const postRepo = AppDataSource.getRepository(Post);
    return await postRepo.find({
      order: { created_at: 'DESC' },
      relations: ['author'],
    });
  },

  async getPostById(id: number) {
    const postRepo = AppDataSource.getRepository(Post);
    return await postRepo.findOne({
      where: { id },
      relations: ['author'],
    });
  },

  async updatePost(id: number, updates: UpdatePostDTO, userId: number) {
    const postRepo = AppDataSource.getRepository(Post);
    const post = await postRepo.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) throw new Error('Post not found');
    // if (post.author.id !== userId) throw new Error('Not authorized');

    Object.assign(post, updates, { updated_at: new Date() });

    return await postRepo.save(post);
  },

  async deletePost(id: number, userId: number) {
    const postRepo = AppDataSource.getRepository(Post);
    const post = await postRepo.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) throw new Error('Post not found');
    // if (post.author.id !== userId) throw new Error('Not authorized');

    await postRepo.remove(post);
    return true;
  },
};
