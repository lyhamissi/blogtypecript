"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
const common_schema_1 = require("./common.schema");
const UserRole_1 = require("../enums/UserRole");
exports.createUserSchema = zod_1.z.object({
    username: zod_1.z.string().min(3, 'Username must be at least 3 characters long'),
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters long'),
    UserRole: zod_1.z.nativeEnum(UserRole_1.UserRole).default(UserRole_1.UserRole.USER),
    profile_image: zod_1.z.string().optional(),
});
exports.updateUserSchema = zod_1.z.object({
    params: common_schema_1.idParamSchema,
    username: common_schema_1.nameSchema.optional(),
    email: common_schema_1.emailSchema.optional(),
    password: common_schema_1.passwordSchema.optional(),
    UserRole: zod_1.z.nativeEnum(UserRole_1.UserRole).optional(),
    profileImage: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
});
;
