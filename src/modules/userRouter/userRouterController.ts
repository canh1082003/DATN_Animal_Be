import { NextFunction, Request } from 'express';
import userRouterService from './userRouterService';
import { HttpStatusCode } from '@/common/constants';
import BadRequestException from '@/common/exception/BadRequestException';
import AuthErrorCode from '@/utils/AuthErrorCode';
import 'express-async-errors';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '@/exception/request-validation-error';
import { ResponseCustom } from '@/utils/expressCustom';
import { Hashing } from '@/utils/hashing';
import { Unauthorized } from '@/exception/unauthorized-error';
import { sendEmail } from '@/utils/mail';
class UserRouterController {
  async Register(req: Request, res: ResponseCustom, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
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

      // eslint-disable-next-line @typescript-eslint/await-thenable
      await sendEmail({
        email,
        subject: 'Verify email',
        message: `Your verify token is ${user.verifyEmailToken}`,
      });
      return res.status(HttpStatusCode.CREATED).json({
        httpStatusCode: HttpStatusCode.CREATED,
        data: { email: user.email },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async verifyEmail(req: Request, res: ResponseCustom, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
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
  async Login(req: Request, res: ResponseCustom, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
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
      return res.status(HttpStatusCode.OK).json({
        httpStatusCode: HttpStatusCode.OK,
        data: {
          email: user.email,
          role: user.role,
        },
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
}
export default new UserRouterController();
