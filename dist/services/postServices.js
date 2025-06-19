import { AppDataSource } from '../config/database';
import { Post } from '../entities/Post';
import { User } from '../entities/User';
export const PostService = {
    async createPost({ title, body, userId }) {
        const postRepo = AppDataSource.getRepository(Post);
        const userRepo = AppDataSource.getRepository(User);
        const author = await userRepo.findOneBy({ id: userId });
        if (!author) {
            throw new Error('User not found');
        }
        const post = postRepo.create({ title, body, author });
        return await postRepo.save(post);
    },
    async getAllPosts() {
        const postRepo = AppDataSource.getRepository(Post);
        return await postRepo.find({ order: { created_at: 'DESC' } });
    },
    async getPostById(id) {
        const postRepo = AppDataSource.getRepository(Post);
        const post = await postRepo.findOne({
            where: { id },
            relations: ['author'],
        });
        return post;
    },
    async updatePost(id, { title, body }, userId) {
        const postRepo = AppDataSource.getRepository(Post);
        const post = await postRepo.findOne({
            where: { id },
            relations: ['author'],
        });
        if (!post)
            throw new Error('Post not found');
        if (post.author.id !== userId)
            throw new Error('Not authorized');
        post.title = title;
        post.body = body;
        post.updated_at = new Date();
        return await postRepo.save(post);
    },
    async deletePost(id, userId) {
        const postRepo = AppDataSource.getRepository(Post);
        const post = await postRepo.findOne({
            where: { id },
            relations: ['author'],
        });
        if (!post)
            throw new Error('Post not found');
        if (post.author.id !== userId)
            throw new Error('Not authorized');
        await postRepo.remove(post);
        return true; // or return a message/object if preferred
    },
};
