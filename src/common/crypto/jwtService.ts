import { UserDbType } from '../../modules/users/types/usersTypes';
import settings from '../../settings';
let jwt = require('jsonwebtoken');

export const jwtService = {
  /** Creating JWT token for acc access */
  async createJWT(userId: string) {
    return jwt.sign({ userId: userId }, settings.JWT_SECRET, {
      expiresIn: '10s',
    });
  },

  /** Creating JWT token for refresh tokens. Giving back new refresh token and token version */
  async refreshJWT(
    userId: string,
  ): Promise<{ refreshToken: string; tokenVersion: string }> {
    const refreshToken: string = jwt.sign(
      { userId: userId },
      settings.JWT_REFRESH_SECRET,
      {
        expiresIn: '20s',
      },
    );
    const decoded = jwt.decode(refreshToken);
    const tokenVersion: string = decoded.exp.toString();
    return { refreshToken, tokenVersion };
  },

  /** getting user id by token from request headers */
  async getUserByToken(token: string) {
    try {
      return jwt.verify(token, settings.JWT_SECRET);
    } catch (error) {
      return null;
    }
  },
  async getUserByRefreshToken(refreshToken: string) {
    try {
      return jwt.verify(refreshToken, settings.JWT_REFRESH_SECRET);
    } catch (error) {
      return null;
    }
  },
};
