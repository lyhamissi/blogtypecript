var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
let Recipe = class Recipe {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", String)
], Recipe.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Recipe.prototype, "title", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Recipe.prototype, "description", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Recipe.prototype, "instructions", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Recipe.prototype, "image", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Recipe.prototype, "category", void 0);
__decorate([
    ManyToOne(() => User, user => user.recipes, { eager: true }),
    JoinColumn({ name: 'addedById' }),
    __metadata("design:type", User)
], Recipe.prototype, "addedBy", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Recipe.prototype, "addedById", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], Recipe.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn(),
    __metadata("design:type", Date)
], Recipe.prototype, "updatedAt", void 0);
Recipe = __decorate([
    Entity('recipes')
], Recipe);
export { Recipe };
