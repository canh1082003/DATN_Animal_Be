import { Router } from 'express';
import userRouterController from './userController';
import {
  GetVerifyEmailTokenMiddleWare,
  LoginMiddleware,
  RegisterMiddleware,
} from '@/middlewares/user.middlewares';
import verifyTokenMiddleware from '@/middlewares/chat.middlewares';

export const UserRouter = Router();
UserRouter.post('/register', RegisterMiddleware, userRouterController.Register);
UserRouter.get('/all', userRouterController.getAllUser);
UserRouter.post(
  '/login',
  verifyTokenMiddleware,
  LoginMiddleware,
  userRouterController.Login
);
UserRouter.put(
  '/update/:id',
  verifyTokenMiddleware,
  userRouterController.UpdateUserById
);
UserRouter.delete(
  '/deleteUser/:id',
  verifyTokenMiddleware,
  userRouterController.deleteUserById
);
UserRouter.post(
  '/verifyEmail',
  GetVerifyEmailTokenMiddleWare,
  userRouterController.verifyEmail
);
UserRouter.post(
  '/SendComfirmCode/:email',
  userRouterController.SendComfirmCode
);
