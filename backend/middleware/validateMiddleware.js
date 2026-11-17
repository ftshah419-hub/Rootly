import { ApiError } from '../utils/ApiError.js';

export const validate = (validatorFn) => {
  return (req, res, next) => {
    try {
      const errors = validatorFn(req);
      if (errors && errors.length > 0) {
        return next(new ApiError(400, 'Validation failed', errors));
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default validate;
