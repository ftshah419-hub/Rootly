import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rootly',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'rootly_jwt_access_secret_dev_key_123',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'rootly_jwt_refresh_secret_dev_key_456',
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || '15m',
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || '30d',
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  EMAIL_PORT: process.env.EMAIL_PORT || 587,
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'Rootly Harvest Network <noreply@rootly.local>',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || ''
};

export const validateEnv = () => {
  const warnings = [];
  if (!process.env.MONGODB_URI) {
    warnings.push('MONGODB_URI is not set. Defaulting to local MongoDB (mongodb://127.0.0.1:27017/rootly)');
  }
  if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
    warnings.push('JWT secrets are using development fallbacks. Set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET in production.');
  }
  if (warnings.length > 0 && process.env.NODE_ENV === 'production') {
    throw new Error(`Critical environment configuration error(s):\n${warnings.join('\n')}`);
  } else if (warnings.length > 0) {
    warnings.forEach((w) => console.warn(`[ENV WARNING] ${w}`));
  }
};
