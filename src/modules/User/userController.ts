import { NextFunction, Request } from 'express';
import userRouterService from './userService';
import { HttpStatusCode } from '@/common/constants';
import BadRequestException from '@/common/exception/BadRequestException';
import AuthErrorCode from '@/utils/AuthErrorCode';
import 'express-async-errors';
import { validationResult } from 'express-validator';
import { ResponseCustom } from '@/utils/expressCustom';
import { Hashing } from '@/utils/hashing';
import jwt from 'jsonwebtoken';
import { sendEmail } from '@/utils/mail';
import Unauthorized from '@/common/exception/Unauthorized';
import { ChatMessage } from '@/databases/entities/ChatMessage';
import path from 'path';
import fs from 'fs';
class UserRouterController {
  async Register(req: Request, res: ResponseCustom, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestException(errors.array());
    }
    try {
      const { firstName, lastName, email, password, confirmPassword } =
        req.body;
      if (password !== confirmPassword) {
        throw new BadRequestException({
          errorCode: AuthErrorCode.NOT_MATCH,
          errorMessage: 'Password not match',
        });
      }
      const userExists = await userRouterService.findUserByEmail(email);
      if (userExists) {
        throw new BadRequestException({
          errorCode: AuthErrorCode.EXISTS_USER,
          errorMessage: 'User Already exists',
        });
      }
      const user = await userRouterService.register(
        firstName,
        lastName,
        email,
        password
      );
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await sendEmail({
        email,
        subject: 'Verify email',
        message: `Your verify token is ${user.verifyEmailToken}`,
      });
      return res.status(HttpStatusCode.CREATED).json({
        httpStatusCode: HttpStatusCode.CREATED,
        data: { email: user.email, token },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async SendComfirmCode(req: Request, res: ResponseCustom, next: NextFunction) {
    try {
      const { email } = req.params;
      const user = await userRouterService.findUserByEmail(email);
      if (!user) {
        throw new BadRequestException({
          errorCode: AuthErrorCode.NOT_FOUND,
          errorMessage: 'User not found',
        });
      }
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await sendEmail({
        email,
        subject: 'Verify email',
        message: `Your verify token is ${user.verifyEmailToken}`,
      });
      return res.status(HttpStatusCode.CREATED).json({
        httpStatusCode: HttpStatusCode.CREATED,
        data: { email: user.email, token },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async Login(req: Request, res: ResponseCustom, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestException(errors.array());
    }
    try {
      const { email, password } = req.body;
      const user = await userRouterService.findUserByEmail(email);
      if (!user) {
        throw new Unauthorized({
          errorCode: AuthErrorCode.INVALID_EMAIL,
          errorMessage: 'Not found any account with this email',
        });
      }
      const passwordcompare = await Hashing.compare(user.password, password);
      if (!passwordcompare) {
        throw new Unauthorized({
          errorCode: AuthErrorCode.WRONG_PASSWORD,
          errorMessage: 'Wrong password',
        });
      }
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      const filePath = path.join(__dirname, 'training.txt');
      let rawContent = fs.readFileSync(filePath, 'utf8');
      rawContent = rawContent.replace(/\r?\n/g, '\n');
      const existedSystemMsg = await ChatMessage.findOne({
        userId: user.id,
        role: 'system',
      });
      if (!existedSystemMsg) {
        await ChatMessage.create({
          userId: user.id,
          role: 'system',
          content: rawContent,
          timestamp: new Date(),
        });
      }
      return res.status(HttpStatusCode.OK).json({
        httpStatusCode: HttpStatusCode.OK,
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          isVerifyEmail: user.isVerifyEmail,
          token,
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async verifyEmail(req: Request, res: ResponseCustom, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestException(errors.array());
    }
    try {
      const { verifyEmailToken } = req.body;
      await userRouterService.findAndVerifyEmailUser(verifyEmailToken);
      return res.status(HttpStatusCode.OK).json({
        httpStatusCode: HttpStatusCode.OK,
        data: 'Verify success',
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async getAllUser(req: Request, res: ResponseCustom, next: NextFunction) {
    try {
      const user = await userRouterService.getAllUser();
      return res.status(HttpStatusCode.OK).json({
        httpStatusCode: HttpStatusCode.OK,
        data: user,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async deleteUserById(req: Request, res: ResponseCustom, next: NextFunction) {
    try {
      const { id } = req.params;
      await userRouterService.deleteUserById(id);
      return res.status(HttpStatusCode.OK).json({
        httpStatusCode: HttpStatusCode.OK,
        data: 'Delete User Succes',
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async UpdateUserById(req: Request, res: ResponseCustom, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body;
      const user = await userRouterService.updateUserById(id, data);
      return res.status(HttpStatusCode.OK).json({
        httpStatusCode: HttpStatusCode.OK,
        data: user,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
export default new UserRouterController();
