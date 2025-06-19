import { ZodError } from 'zod';
import { ValidationError } from '../utils/errors';
/**
 * Middleware to validate incoming request using a Zod schema.
 * Pass a schema object that may include body, params, or query.
 */
export const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                const errors = {};
                error.errors.forEach((err) => {
                    const path = err.path.join('.');
                    if (!errors[path]) {
                        errors[path] = [];
                    }
                    errors[path].push(err.message);
                });
                next(new ValidationError(errors));
            }
            else {
                next(error);
            }
        }
    };
};
/**
 * Helper function to manually validate any data object with a Zod schema.
 * Useful for internal logic outside of request handling.
 */
export const validateData = (schema, data) => {
    try {
        return schema.parse(data);
    }
    catch (error) {
        if (error instanceof ZodError) {
            const errors = {};
            error.errors.forEach((err) => {
                const path = err.path.join('.');
                if (!errors[path]) {
                    errors[path] = [];
                }
                errors[path].push(err.message);
            });
            throw new ValidationError(errors);
        }
        throw error;
    }
};
