import { ApiError } from '../utils/ApiError.js';

export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'Authentication required before checking administrator privileges.'));
  }

  if (req.user.role !== 'ADMIN') {
    return next(new ApiError(403, 'Access denied. Administrator privileges are required.'));
  }

  next();
};

export default requireAdmin;
