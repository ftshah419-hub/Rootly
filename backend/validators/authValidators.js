export const validateRegistration = (req) => {
  const errors = [];
  const { name, email, password, confirmPassword } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Full name is required and must be at least 2 characters.');
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!email || !emailRegex.test(email.trim())) {
    errors.push('A valid email address is required.');
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    errors.push('Password must be at least 8 characters long.');
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    errors.push('Password confirmation does not match password.');
  }

  // Security check: Never allow client to specify role
  if (req.body.role) {
    delete req.body.role;
  }

  return errors;
};

export const validateLogin = (req) => {
  const errors = [];
  const { email, password } = req.body;

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!email || !emailRegex.test(email.trim())) {
    errors.push('A valid email address is required.');
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    errors.push('Password is required.');
  }

  return errors;
};

export const validateForgotPassword = (req) => {
  const errors = [];
  const { email } = req.body;

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!email || !emailRegex.test(email.trim())) {
    errors.push('A valid email address is required.');
  }

  return errors;
};

export const validateResetPassword = (req) => {
  const errors = [];
  const { token, password, confirmPassword } = req.body;

  if (!token || typeof token !== 'string') {
    errors.push('Valid reset token is required.');
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    errors.push('New password must be at least 8 characters long.');
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    errors.push('Password confirmation does not match.');
  }

  return errors;
};
