var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, } from 'typeorm';
import { User } from './User';
let Post = class Post {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Post.prototype, "id", void 0);
__decorate([
    Column({ length: 255, nullable: false, default: 'Untitled' }),
    __metadata("design:type", String)
], Post.prototype, "title", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Post.prototype, "summary", void 0);
__decorate([
    Column('text', { nullable: true }),
    __metadata("design:type", String)
], Post.prototype, "content", void 0);
__decorate([
    Column({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], Post.prototype, "image", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.id, { nullable: false, onDelete: 'CASCADE' }),
    JoinColumn({ name: 'author' }),
    __metadata("design:type", User)
], Post.prototype, "author", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], Post.prototype, "created_at", void 0);
__decorate([
    UpdateDateColumn(),
    __metadata("design:type", Date)
], Post.prototype, "updated_at", void 0);
Post = __decorate([
    Entity('posts')
], Post);
export { Post };
