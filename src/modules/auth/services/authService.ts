import { comparePassword } from '../crypto/verifyPassword';
import { authRepository } from '../repositories/authRepository';
import { UserDbType } from '../../users/types/usersTypes';
import settings from '../../../settings';
import { ObjectId } from 'mongodb';
let jwt = require('jsonwebtoken');

export const authService = {
  //checking credentials
  async loginUser(loginField: string, passwordField: string): Promise<UserDbType> {
    const user = await authRepository.getHash(loginField);

    if (!user?.passwordHash) {
      const errors: { [key: string]: string } = {};
      if (loginField.includes('@')) {
        errors.email = 'User not found. Invalid email.';
      } else {
        errors.login = 'User not found. Invalid login.';
      }
      throw {
        errorsMessages: Object.keys(errors).map(
          (field): { field: string; message: string } => ({
            field,
            message: errors[field],
          }),
        ),
      };
    }
    const passwordIsMatch = await comparePassword(passwordField, user.passwordHash);
    if (!passwordIsMatch) {
      throw {
        errorsMessages: [{ field: 'password', message: 'Incorrect password' }],
      };
    }
    return user;
  },

  //token creating
  async createJWT(user: UserDbType) {
    return jwt.sign({ userId: user._id }, settings.JWT_SECRET, {
      expiresIn: '1h',
    });
  },

  // getting user id by token from request headers
  async getUserByToken(token: string) {
    try {
      return jwt.verify(token, settings.JWT_SECRET);
    } catch (error) {
      return null;
    }
  },
};
