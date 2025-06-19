"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Post_1 = require("../entities/Post");
const User_1 = require("../entities/User");
const Token_1 = require("../entities/Token");
const Recipes_1 = require("../entities/Recipes");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    url: process.env.DATABASE_URL,
    entities: [User_1.User, Post_1.Post, Token_1.Token, Recipes_1.Recipe],
    migrations: ['dist/migrations/*.js'],
    synchronize: false,
    ssl: {
        rejectUnauthorized: false, // Accept self-signed certs
    },
    extra: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
});
