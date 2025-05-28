import { z } from "zod";

export const emailSchema = z
    .string()
    .email("Email form is not valid")
    .max(100, "Email must be less than 100 characters");

export const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(255, "Password must be less than 255 characters")
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    );
export const idParamSchema = z.object({
    id: z.string().regex(/^\d+$/, "ID must be a valid number").transform(Number),
})
export const nameSchema = z
    .string()