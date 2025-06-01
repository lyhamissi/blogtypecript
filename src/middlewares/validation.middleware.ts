import { Request, Response, NextFunction } from 'express';
import { z, ZodError, ZodSchema } from 'zod';
import { ValidationError } from '../utils/errors';

/**
 * Middleware to validate incoming request using a Zod schema.
 * Pass a schema object that may include body, params, or query.
 */
export const validate = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {};

        error.errors.forEach((err) => {
          const path = err.path.join('.');
          if (!errors[path]) {
            errors[path] = [];
          }
          errors[path].push(err.message);
        });

        next(new ValidationError(errors));
      } else {
        next(error);
      }
    }
  };
};

/**
 * Helper function to manually validate any data object with a Zod schema.
 * Useful for internal logic outside of request handling.
 */
export const validateData = <T>(schema: ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: Record<string, string[]> = {};

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
