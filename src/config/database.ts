import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Post } from '../entities/Post';
import { User } from '../entities/User';
import { Token } from '../entities/Token';
import { Recipe } from '../entities/Recipes';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  url: process.env.DATABASE_URL,
  entities: [User, Post,Token,Recipe],
  migrations: ['src/migrations/*.ts'],
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
