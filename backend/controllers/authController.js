import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/responseHandler.js';
import * as authService from '../services/authService.js';
import { ENV } from '../config/env.js';

// Cookie options helper
const getCookieOptions = (isRefresh = false) => ({
  httpOnly: true,
  secure: ENV.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: isRefresh ? 30 * 24 * 60 * 60 * 1000 : 15 * 60 * 1000
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, preferredLanguage, interests } = req.body;
  const result = await authService.registerUser({
    name,
    email,
    password,
    phone,
    preferredLanguage,
    interests
  });

  // Set HttpOnly refresh cookie
  res.cookie('refreshToken', result.refreshToken, getCookieOptions(true));

  return sendResponse(res, 201, 'User registration successful', {
    user: result.user,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password, rememberDevice } = req.body;
  const deviceInfo = req.headers['user-agent'] || 'Web Browser';

  const result = await authService.loginUser({
    email,
    password,
    deviceInfo
  });

  const cookieOptions = getCookieOptions(true);
  if (!rememberDevice) {
    delete cookieOptions.maxAge; // Session cookie
  }

  res.cookie('refreshToken', result.refreshToken, cookieOptions);

  return sendResponse(res, 200, 'Sign in successful', {
    user: result.user,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  const deviceInfo = req.headers['user-agent'] || 'Web Browser';

  const result = await authService.refreshSession(token, deviceInfo);

  res.cookie('refreshToken', result.refreshToken, getCookieOptions(true));

  return sendResponse(res, 200, 'Token refreshed successfully', {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    user: result.user
  });
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  await authService.logoutUser(token);

  res.clearCookie('refreshToken', getCookieOptions(true));
  res.clearCookie('accessToken');

  return sendResponse(res, 200, 'Logged out successfully');
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await authService.forgotPassword(email);

  return sendResponse(res, 200, result.message, {
    devToken: result.devToken
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const result = await authService.resetPassword(token, password);

  return sendResponse(res, 200, result.message);
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user._id);
  return sendResponse(res, 200, 'Current profile retrieved', { user });
});
