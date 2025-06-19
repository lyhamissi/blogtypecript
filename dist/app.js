"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const swagger_1 = require("./swagger");
const recipeRoutes_1 = __importDefault(require("./routes/recipeRoutes"));
const app = (0, express_1.default)();
(0, swagger_1.setupSwagger)(app);
app.use(express_1.default.json());
app.use('/api/auth', authRoutes_1.default);
app.use('/api/posts', postRoutes_1.default);
app.use('/api/recipes', recipeRoutes_1.default);
app.use(errorHandler_1.errorHandler);
exports.default = app;
