// src/entities/User.ts

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Post } from './Post';
import { OneToMany } from 'typeorm';


@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100, nullable: false })
    username!: string;

    @Column({ length: 100, unique: true, nullable: false })
    email!: string;

    @Column({ length: 255, nullable: false })
    password!: string;

    @CreateDateColumn({ name: 'created_at' })
    created_at!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at!: Date;

    @OneToMany(() => Post, (post) => post.author)
    posts!: Post[];

}
