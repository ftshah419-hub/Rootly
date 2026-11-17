import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { ENV } from '../config/env.js';

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    ENV.JWT_ACCESS_SECRET,
    {
      expiresIn: ENV.ACCESS_TOKEN_EXPIRY
    }
  );
};

export const generateRefreshTokenString = () => {
  return crypto.randomBytes(40).toString('hex');
};

export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, ENV.JWT_ACCESS_SECRET);
  } catch (error) {
    return null;
  }
};
