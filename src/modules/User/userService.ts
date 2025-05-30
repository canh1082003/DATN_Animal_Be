import BadRequestException from '@/common/exception/BadRequestException';
import User from '@/databases/entities/User';
import AuthErrorCode from '@/utils/AuthErrorCode';
import { Hashing } from '@/utils/hashing';
import { randomBytes } from 'crypto';
import { UserInterFace } from './type';

class UserRouterService {
  async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    const hashingPassword = await Hashing.toHash(password);
    const verifyEmailToken = randomBytes(8).toString('hex');
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashingPassword,
      role: 'user',
      verifyEmailToken,
    });
    return await user.save();
  }
  async findUserByEmail(email: string) {
    return await User.findOne({ email });
  }
  async getAllUser() {
    return await User.find();
  }
  async deleteUserById(id: string) {
    return await User.findByIdAndDelete(id);
  }
  async findAndVerifyEmailUser(verifyEmailToken: string) {
    const user = await User.findOne({ verifyEmailToken });
    if (!user) {
      throw new BadRequestException({
        errorCode: AuthErrorCode.INVALID_VERIFY_EMAIL_TOKEN,
        errorMessage: `Not found any user with token ${verifyEmailToken}`,
      });
    }
    if (user.isVerifyEmail) {
      throw new BadRequestException({
        errorCode: AuthErrorCode.INVALID_VERIFY_EMAIL_TOKEN,
        errorMessage: 'Email verify already',
      });
    }
    if (user.verifyEmailToken !== verifyEmailToken) {
      throw new BadRequestException({
        errorCode: AuthErrorCode.INVALID_VERIFY_EMAIL_TOKEN,
        errorMessage: 'Invalid token',
      });
    }

    user.isVerifyEmail = true;
    return await user.save();
  }
  async updateUserById(id: string, data: Partial<UserInterFace>) {
    const userId = await User.findById(id);
    if (!userId) {
      throw new Error('Not Found User');
    }
    Object.assign(userId, data);
    return await userId?.save();
  }
}
export default new UserRouterService();
