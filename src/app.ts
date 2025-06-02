import express from 'express';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { setupSwagger } from './swagger';

const app = express();

setupSwagger(app);
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.use(errorHandler);
export default app;
