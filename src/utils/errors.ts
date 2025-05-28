export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;
  
    constructor(message: string, statusCode: number, isOperational = true) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = isOperational;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }

  export class ValidationError extends AppError {
    public errors: Record<string, string[]>;
  
    constructor(errors: Record<string, string[]>, message = 'Validation failed') {
      super(message, 400);
      this.errors = errors;
    }
  }

  export class NotFoundError extends AppError {
    constructor(resource: string = 'Resource') {
      super(`${resource} not found`, 404);
    }
  }

  export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized access') {
      super(message, 401);
    }
  }

  export class ForbiddenError extends AppError {
    constructor(message = 'Access forbidden') {
      super(message, 403);
    }
  }

  export class ConflictError extends AppError {
    constructor(message = 'Resource already exists') {
      super(message, 409);
    }
  }