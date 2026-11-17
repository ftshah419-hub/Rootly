import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { RefreshSession } from '../models/RefreshSession.js';
import { PasswordResetToken } from '../models/PasswordResetToken.js';
import { ApiError } from '../utils/ApiError.js';
import {
  generateAccessToken,
  generateRefreshTokenString,
  hashToken
} from '../utils/generateToken.js';
import { sendPasswordResetEmail } from './emailService.js';
import { ENV } from '../config/env.js';

export const registerUser = async ({ name, email, password, phone, preferredLanguage, interests }) => {
  const normalizedEmail = email.trim().toLowerCase();

  // Check duplicate email
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ApiError(409, 'An account with this email address already exists.');
  }

  // Hash password securely (bcrypt salt rounds = 12)
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  // Mandatory security rule: Registration always assigns USER role
  const newUser = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    phone: phone ? phone.trim() : '',
    role: 'USER',
    accountStatus: 'ACTIVE',
    preferredLanguage: preferredLanguage === 'ml' ? 'ml' : 'en',
    profile: {
      interests: Array.isArray(interests) ? interests : []
    }
  });

  // Generate tokens
  const accessToken = generateAccessToken(newUser);
  const refreshToken = generateRefreshTokenString();
  const tokenHash = hashToken(refreshToken);

  // Expiry calculation: default 30 days
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  // Store only the hash of the refresh token
  await RefreshSession.create({
    userId: newUser._id,
    tokenHash,
    deviceInfo: 'Web Client',
    expiresAt
  });

  return {
    user: newUser.toSafeObject(),
    accessToken,
    refreshToken
  };
};

export const loginUser = async ({ email, password, deviceInfo = 'Web Client' }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  // Verify password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  // Verify account status
  if (user.accountStatus === 'BLOCKED') {
    throw new ApiError(403, 'Your account has been permanently blocked.');
  }
  if (user.accountStatus === 'SUSPENDED') {
    throw new ApiError(403, 'Your account is suspended. Please contact support.');
  }
  if (user.accountStatus === 'DEACTIVATED') {
    throw new ApiError(403, 'This account has been deactivated.');
  }

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshTokenString();
  const tokenHash = hashToken(refreshToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  // Store hashed refresh session
  await RefreshSession.create({
    userId: user._id,
    tokenHash,
    deviceInfo,
    expiresAt
  });

  return {
    user: user.toSafeObject(),
    accessToken,
    refreshToken
  };
};

export const refreshSession = async (incomingRefreshToken, deviceInfo = 'Web Client') => {
  if (!incomingRefreshToken) {
    throw new ApiError(401, 'Refresh token is required.');
  }

  const incomingHash = hashToken(incomingRefreshToken);

  // Find active session
  const session = await RefreshSession.findOne({
    tokenHash: incomingHash,
    revokedAt: null,
    expiresAt: { $gt: new Date() }
  });

  if (!session) {
    throw new ApiError(401, 'Invalid or expired refresh token. Please sign in again.');
  }

  // Revoke old session (Refresh Token Rotation)
  session.revokedAt = new Date();
  await session.save();

  // Find user
  const user = await User.findById(session.userId);
  if (!user || user.accountStatus !== 'ACTIVE') {
    throw new ApiError(401, 'User account is no longer active.');
  }

  // Issue new tokens
  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshTokenString();
  const newTokenHash = hashToken(newRefreshToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await RefreshSession.create({
    userId: user._id,
    tokenHash: newTokenHash,
    deviceInfo,
    expiresAt
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    user: user.toSafeObject()
  };
};

export const logoutUser = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) return true;

  const incomingHash = hashToken(incomingRefreshToken);
  await RefreshSession.updateMany(
    { tokenHash: incomingHash, revokedAt: null },
    { $set: { revokedAt: new Date() } }
  );

  return true;
};

export const forgotPassword = async (email) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  // Security best practice: Never reveal if email exists
  if (!user) {
    return {
      message: 'If that email address is in our database, we will send you a password reset link shortly.'
    };
  }

  // Generate random 32-byte token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(resetToken);

  // 1 hour expiry
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  // Save hashed token
  await PasswordResetToken.create({
    userId: user._id,
    tokenHash,
    expiresAt
  });

  // Send email
  await sendPasswordResetEmail(user.email, resetToken, user.name);

  return {
    message: 'If that email address is in our database, we will send you a password reset link shortly.',
    devToken: ENV.NODE_ENV === 'development' ? resetToken : undefined
  };
};

export const resetPassword = async (resetToken, newPassword) => {
  if (!resetToken) {
    throw new ApiError(400, 'Reset token is required.');
  }

  const tokenHash = hashToken(resetToken);

  // Find token
  const resetDoc = await PasswordResetToken.findOne({
    tokenHash,
    usedAt: null,
    expiresAt: { $gt: new Date() }
  });

  if (!resetDoc) {
    throw new ApiError(400, 'Password reset token is invalid or has expired.');
  }

  const user = await User.findById(resetDoc.userId);
  if (!user) {
    throw new ApiError(404, 'User associated with token not found.');
  }

  // Hash new password
  const salt = await bcrypt.genSalt(12);
  user.passwordHash = await bcrypt.hash(newPassword, salt);
  await user.save();

  // Invalidate reset token
  resetDoc.usedAt = new Date();
  await resetDoc.save();

  // Invalidate ALL active refresh sessions for this user for security
  await RefreshSession.updateMany(
    { userId: user._id, revokedAt: null },
    { $set: { revokedAt: new Date() } }
  );

  return { message: 'Password has been successfully updated. You may now sign in.' };
};

export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found.');
  }
  return user.toSafeObject();
};
