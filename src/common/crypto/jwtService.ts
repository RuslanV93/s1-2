import { UserDbType } from '../../modules/users/types/usersTypes';
import settings from '../../settings';
let jwt = require('jsonwebtoken');

export const jwtService = {
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
