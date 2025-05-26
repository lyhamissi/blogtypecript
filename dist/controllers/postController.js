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
const database_1 = require("../database");
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, body } = req.body;
    const userId = req.userId;
    try {
        const result = yield database_1.pool.query('INSERT INTO posts (title, body, author) VALUES ($1, $2, $3) RETURNING *', [title, body, userId]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to create post' });
    }
});
exports.createPost = createPost;
const getAllPosts = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.pool.query('SELECT * FROM posts ORDER BY created_at DESC');
        res.json(result.rows);
    }
    catch (_a) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});
exports.getAllPosts = getAllPosts;
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield database_1.pool.query('SELECT * FROM posts WHERE id = $1', [id]);
        const post = result.rows[0];
        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        res.json(post);
    }
    catch (_a) {
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});
exports.getPostById = getPostById;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, body } = req.body;
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const result = yield database_1.pool.query('SELECT * FROM posts WHERE id = $1', [id]);
        const post = result.rows[0];
        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        if (post.author !== userId) {
            res.status(403).json({ error: 'Not authorized' });
            return;
        }
        const updated = yield database_1.pool.query('UPDATE posts SET title = $1, body = $2, updated_at = NOW() WHERE id = $3 RETURNING *', [title, body, id]);
        res.json(updated.rows[0]);
    }
    catch (_a) {
        res.status(500).json({ error: 'Failed to update post' });
    }
});
exports.updatePost = updatePost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const result = yield database_1.pool.query('SELECT * FROM posts WHERE id = $1', [id]);
        const post = result.rows[0];
        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        if (post.author !== userId) {
            res.status(403).json({ error: 'Not authorized' });
            return;
        }
        yield database_1.pool.query('DELETE FROM posts WHERE id = $1', [id]);
        res.json({ message: 'Post deleted' });
    }
    catch (_a) {
        res.status(500).json({ error: 'Failed to delete post' });
    }
});
exports.deletePost = deletePost;
