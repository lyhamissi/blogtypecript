var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, } from 'typeorm';
import { User } from './User';
let Token = class Token {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Token.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Token.prototype, "userId", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.tokens, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'userId' }),
    __metadata("design:type", User)
], Token.prototype, "user", void 0);
__decorate([
    Column({ length: 255 }),
    __metadata("design:type", String)
], Token.prototype, "token", void 0);
__decorate([
    Column({ length: 50 }),
    __metadata("design:type", String)
], Token.prototype, "type", void 0);
__decorate([
    Column({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Token.prototype, "expiresAt", void 0);
__decorate([
    Column({ default: false }),
    __metadata("design:type", Boolean)
], Token.prototype, "used", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' }),
    __metadata("design:type", Date)
], Token.prototype, "createdAt", void 0);
Token = __decorate([
    Entity('tokens')
], Token);
export { Token };
