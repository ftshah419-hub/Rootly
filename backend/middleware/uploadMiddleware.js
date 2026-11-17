import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';

// In-memory storage for Cloudinary or AI processing
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Unsupported file type. Please upload an image (JPG, PNG, WebP).'), false);
  }
};

export const uploadSingleImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
}).single('image');

export const uploadMultipleImages = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
}).array('images', 5);
