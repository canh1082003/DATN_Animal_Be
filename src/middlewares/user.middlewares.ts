import { checkSchema } from 'express-validator';

const RegisterMiddleware = checkSchema({
  firstName: {
    notEmpty: true,
    errorMessage: 'First name is required',
  },
  lastName: {
    notEmpty: true,
    errorMessage: 'Last name is required',
  },
  email: {
    isEmail: { errorMessage: 'Please enter a valid email address' },
    notEmpty: { errorMessage: 'Email is required' },
    normalizeEmail: true,
  },
  password: {
    isString: true,
    notEmpty: { errorMessage: 'Password is required' },
    isLength: {
      options: { min: 6 },
      errorMessage: 'Password must be at least 6 characters long',
    },
  },
  confirmPassword: {
    isString: true,
    notEmpty: { errorMessage: 'Confirm password is required' },
  },
});

const LoginMiddleware = checkSchema({
  email: {
    isEmail: { errorMessage: 'Please enter a valid email address' },
    notEmpty: { errorMessage: 'Email is required' },
    normalizeEmail: true,
  },
  password: {
    isString: true,
    notEmpty: { errorMessage: 'Password is required' },
    isLength: {
      options: { min: 6 },
      errorMessage: 'Password must be at least 6 characters long',
    },
  },
});

const GetVerifyEmailTokenMiddleWare = checkSchema({
  verifyEmailToken: {
    notEmpty: { errorMessage: 'Verify Email Token is required' },
    isString: true,
  },
});

export { RegisterMiddleware, LoginMiddleware, GetVerifyEmailTokenMiddleWare };
