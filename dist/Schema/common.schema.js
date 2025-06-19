"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nameSchema = exports.idParamSchema = exports.passwordSchema = exports.emailSchema = void 0;
const zod_1 = require("zod");
exports.emailSchema = zod_1.z
    .string()
    .email("Email form is not valid")
    .max(100, "Email must be less than 100 characters");
exports.passwordSchema = zod_1.z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(255, "Password must be less than 255 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number");
exports.idParamSchema = zod_1.z.object({
    id: zod_1.z
        .string()
        .regex(/^\d+$/, { message: "ID must be a valid number" })
        .transform((val) => parseInt(val, 10)),
});
exports.nameSchema = zod_1.z
    .string();
