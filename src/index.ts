// src/index.ts
import dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';
import app from './app';
import { AppDataSource } from './database';

const PORT = process.env.PORT || 5000;

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    app.listen(PORT, () => {
      console.log(`Server running on http://127.0.0.1:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
