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
  synchronize: true, // set to false in production
  entities: [User, Post,Token,Recipe],
  ssl: {
    rejectUnauthorized: false, // allows self-signed certs (safe with Aiven)
  },
});
