import { AppDataSource } from '../config/database';
import { Post } from '../entities/Post';
export const PostService = {
    async createPost({ title, summary, content, image }) {
        const postRepo = AppDataSource.getRepository(Post);
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
            relations: ['author'], // keep author if you want
        });
    },
    async getPostById(id) {
        const postRepo = AppDataSource.getRepository(Post);
        return await postRepo.findOne({
            where: { id },
            relations: ['author'],
        });
    },
    async updatePost(id, updates) {
        const postRepo = AppDataSource.getRepository(Post);
        const post = await postRepo.findOne({ where: { id } });
        if (!post)
            throw new Error('Post not found');
        Object.assign(post, updates, { updated_at: new Date() });
        return await postRepo.save(post);
    },
    async deletePost(id) {
        const postRepo = AppDataSource.getRepository(Post);
        const post = await postRepo.findOne({ where: { id } });
        if (!post)
            throw new Error('Post not found');
        await postRepo.remove(post);
        return true;
    },
};
