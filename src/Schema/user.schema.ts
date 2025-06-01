import { z } from "zod";
import { emailSchema, idParamSchema, nameSchema, passwordSchema } from "./common.schema";
import { UserRole } from "../enums/UserRole";

export const createUserSchema = z.object({
    body: z.object({
        username: z.string().min(3, 'Username must be at least 3 characters long'),
        email: z.string().email('Invalid email format'),
        password: z.string().min(6, 'Password must be at least 6 characters long'),
        UserRole: z.nativeEnum(UserRole).default(UserRole.USER)

    })
})

export const updateUserSchema = z.object({
    params: idParamSchema,
    body: z.object({
        username: nameSchema.optional(),
        email: emailSchema.optional(),
        password: passwordSchema.optional(),
        UserRole: z.nativeEnum(UserRole).optional(),
        isActive: z.boolean().optional(),
    }).refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided for update",
    }),
});
;

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>