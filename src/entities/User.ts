import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Post } from './Post';
import { Token } from './Token';
import { UserRole } from '../enums/UserRole'; 

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100, nullable: false })
    username!: string;

    @Column({ length: 100, unique: true, nullable: false })
    email!: string;

    @Column({ length: 255, nullable: false, select: false })
    password!: string;

    @Column({ default: false })
    isEmailVerified!: boolean;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    userRole!: UserRole;

    @CreateDateColumn({ name: 'created_at' })
    created_at!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at!: Date;

    @OneToMany(() => Post, (post) => post.author)
    posts!: Post[];

    @OneToMany(() => Token, token => token.user)
    tokens!: Token[];
}
