import { ApiError } from '../utils/ApiError.js';
import { ENV } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  let error = err;

  // If not an instance of ApiError, convert it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, error.errors || [], err.stack);
  }

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new ApiError(409, `An entry with this ${field} already exists.`);
  }

  // Handle Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    error = new ApiError(400, `Invalid ${err.path}: ${err.value}`);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid authentication token');
  }
  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Authentication token expired');
  }

  const response = {
    success: false,
    message: error.message,
    errors: error.errors && error.errors.length > 0 ? error.errors : undefined,
    ...(ENV.NODE_ENV === 'development' && { stack: error.stack })
  };

  return res.status(error.statusCode || 500).json(response);
};

export const notFoundHandler = (req, res, next) => {
  const error = new ApiError(404, `Endpoint not found: ${req.method} ${req.originalUrl}`);
  next(error);
};
