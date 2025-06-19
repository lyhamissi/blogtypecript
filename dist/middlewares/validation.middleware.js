"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateData = exports.validate = void 0;
const zod_1 = require("zod");
const errors_1 = require("../utils/errors");
/**
 * Middleware to validate incoming request using a Zod schema.
 * Pass a schema object that may include body, params, or query.
 */
const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errors = {};
                error.errors.forEach((err) => {
                    const path = err.path.join('.');
                    if (!errors[path]) {
                        errors[path] = [];
                    }
                    errors[path].push(err.message);
                });
                next(new errors_1.ValidationError(errors));
            }
            else {
                next(error);
            }
        }
    };
};
exports.validate = validate;
/**
 * Helper function to manually validate any data object with a Zod schema.
 * Useful for internal logic outside of request handling.
 */
const validateData = (schema, data) => {
    try {
        return schema.parse(data);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const errors = {};
            error.errors.forEach((err) => {
                const path = err.path.join('.');
                if (!errors[path]) {
                    errors[path] = [];
                }
                errors[path].push(err.message);
            });
            throw new errors_1.ValidationError(errors);
        }
        throw error;
    }
};
exports.validateData = validateData;
