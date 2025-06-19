import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255, nullable: false, default: 'Untitled' })
  title!: string;

  @Column('text', { nullable: false })
  body!: string;

  @Column({ type: 'text', nullable: true })
  summary?: string;

  @Column('text', { nullable: true })
  content?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image?: string;

  @ManyToOne(() => User, (user) => user.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author' })
  author!: User;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
