import { Router } from 'express';
import userRouterController from './userRouterController';
import {
  GetVerifyEmailTokenMiddleWare,
  LoginMiddleware,
  RegisterMiddleware,
} from '@/middlewares/user.middlewares';

export const UserRouter = Router();
UserRouter.post('/register', RegisterMiddleware, userRouterController.Register);
UserRouter.get('/all', userRouterController.getAllUser);
UserRouter.post('/login', LoginMiddleware, userRouterController.Login);
UserRouter.delete('/deleteUser/:id', userRouterController.deleteUserById);
UserRouter.post(
  '/verifyEmail',
  GetVerifyEmailTokenMiddleWare,
  userRouterController.verifyEmail
);
