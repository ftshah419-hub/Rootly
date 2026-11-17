import { verifyAccessToken } from '../utils/generateToken.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/User.js';

export const authenticate = asyncHandler(async (req, res, next) => {
  let token = null;

  // 1. Check Authorization Bearer header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    // 2. Fallback to HttpOnly cookie
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new ApiError(401, 'Authentication required. No token provided.');
  }

  const decoded = verifyAccessToken(token);
  if (!decoded) {
    throw new ApiError(401, 'Invalid or expired access token. Please refresh or login again.');
  }

  const user = await User.findById(decoded._id);
  if (!user) {
    throw new ApiError(401, 'User account no longer exists.');
  }

  // Account status validation
  if (user.accountStatus === 'BLOCKED') {
    throw new ApiError(403, 'Your account has been permanently blocked by administration.');
  }
  if (user.accountStatus === 'SUSPENDED') {
    throw new ApiError(403, 'Your account is temporarily suspended. Please contact support.');
  }
  if (user.accountStatus === 'DEACTIVATED') {
    throw new ApiError(403, 'This account has been deactivated.');
  }

  req.user = user;
  next();
});

export default authenticate;
