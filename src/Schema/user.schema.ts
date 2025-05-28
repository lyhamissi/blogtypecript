import { z } from "zod";
import { emailSchema, idParamSchema, nameSchema, passwordSchema } from "./common.schema";
import { UserRole } from "../enums/UserRole";

export const createUserSchema = z.object({
    body: z.object({
        username: nameSchema,
        email: emailSchema,
        password: passwordSchema,
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