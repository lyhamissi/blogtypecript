"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const database_1 = require("../config/database");
const Post_1 = require("../entities/Post");
const User_1 = require("../entities/User");
exports.PostService = {
    createPost(_a) {
        return __awaiter(this, arguments, void 0, function* ({ title, body, userId }) {
            const postRepo = database_1.AppDataSource.getRepository(Post_1.Post);
            const userRepo = database_1.AppDataSource.getRepository(User_1.User);
            const author = yield userRepo.findOneBy({ id: userId });
            if (!author) {
                throw new Error('User not found');
            }
            const post = postRepo.create({ title, body, author });
            return yield postRepo.save(post);
        });
    },
    getAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            const postRepo = database_1.AppDataSource.getRepository(Post_1.Post);
            return yield postRepo.find({ order: { created_at: 'DESC' } });
        });
    },
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const postRepo = database_1.AppDataSource.getRepository(Post_1.Post);
            const post = yield postRepo.findOne({
                where: { id },
                relations: ['author'],
            });
            return post;
        });
    },
    updatePost(id_1, _a, userId_1) {
        return __awaiter(this, arguments, void 0, function* (id, { title, body }, userId) {
            const postRepo = database_1.AppDataSource.getRepository(Post_1.Post);
            const post = yield postRepo.findOne({
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
            return yield postRepo.save(post);
        });
    },
    deletePost(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const postRepo = database_1.AppDataSource.getRepository(Post_1.Post);
            const post = yield postRepo.findOne({
                where: { id },
                relations: ['author'],
            });
            if (!post)
                throw new Error('Post not found');
            if (post.author.id !== userId)
                throw new Error('Not authorized');
            yield postRepo.remove(post);
            return true; // or return a message/object if preferred
        });
    },
};
