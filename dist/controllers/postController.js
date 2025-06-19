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
exports.deletePost = exports.updatePost = exports.getPostById = exports.getAllPosts = exports.createPost = void 0;
const postServices_1 = require("../services/postServices");
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, body } = req.body; // no author from body!
        const userId = req.userId;
        const savedPost = yield postServices_1.PostService.createPost({ title, body, userId });
        res.status(201).json(savedPost);
    }
    catch (err) {
        console.error('Error creating post:', err);
        res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to create post' });
    }
});
exports.createPost = createPost;
const getAllPosts = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield postServices_1.PostService.getAllPosts();
        res.json(posts);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});
exports.getAllPosts = getAllPosts;
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const post = yield postServices_1.PostService.getPostById(Number(id));
        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        res.json(post);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});
exports.getPostById = getPostById;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, body } = req.body;
        const userId = req.userId;
        const updatedPost = yield postServices_1.PostService.updatePost(Number(id), { title, body }, userId);
        res.json(updatedPost);
    }
    catch (err) {
        if (err instanceof Error && (err.message === 'Post not found' || err.message === 'Not authorized')) {
            res.status(err.message === 'Post not found' ? 404 : 403).json({ error: err.message });
        }
        else {
            res.status(500).json({ error: 'Failed to update post' });
        }
    }
});
exports.updatePost = updatePost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userId = req.userId;
        yield postServices_1.PostService.deletePost(Number(id), userId);
        res.json({ message: 'Post deleted' });
    }
    catch (err) {
        if (err instanceof Error && (err.message === 'Post not found' || err.message === 'Not authorized')) {
            res.status(err.message === 'Post not found' ? 404 : 403).json({ error: err.message });
        }
        else {
            res.status(500).json({ error: 'Failed to delete post' });
        }
    }
});
exports.deletePost = deletePost;
