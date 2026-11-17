export const sendResponse = (res, statusCode = 200, message = 'Operation completed', data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const sendError = (res, statusCode = 500, message = 'Internal Server Error', errors = []) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length > 0 ? errors : undefined
  });
};

export default {
  sendResponse,
  sendError
};
