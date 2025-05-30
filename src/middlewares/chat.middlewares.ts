import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AuthenticatedRequest } from '@/hook/AuthenticatedRequest';
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
dotenv.config();

// Định nghĩa các thông báo lỗi
const errorMessages = {
  auth: {
    status: 401,
    message: 'Không có token hoặc token không hợp lệ',
  },
  token: {
    status: 401,
    message: 'Token không hợp lệ hoặc đã hết hạn',
  },
  server: {
    status: 500,
    message: 'Lỗi máy chủ nội bộ',
  },
};

const verifyTokenMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res
        .status(errorMessages.auth.status)
        .json({ message: errorMessages.auth.message });
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res
        .status(errorMessages.auth.status)
        .json({ message: errorMessages.auth.message });
    }

    const token = parts[1];
    const env_jwt = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, env_jwt);
    req.user = {
      id: (decoded as any).id,
    };
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(errorMessages.token.status)
        .json({ message: errorMessages.token.message });
    }

    // Lỗi server khác
    console.error('Lỗi xác thực token:', error);
    return res
      .status(errorMessages.server.status)
      .json({ message: errorMessages.server.message });
  }
};

export const validateGiveFeedback = [
  body('messageId').notEmpty().withMessage('messageId is required'),
  body('feedback')
    .isIn(['useful', 'not_useful'])
    .withMessage('Feedback must be useful or not_useful'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
export default verifyTokenMiddleware;
