import { UserDbType } from '../../features/users/types/usersTypes';
import settings from '../../settings';
import SETTINGS from '../../settings';
let jwt = require('jsonwebtoken');

export const jwtService = {
  /** Creating JWT token for acc access */
  async createJWT(userId: string) {
    return jwt.sign({ userId: userId }, settings.JWT_SECRET, {
      expiresIn: '1h',
    });
  },

  /** Creating JWT token for refresh tokens. Giving back new refresh token and token version */
  async createRefreshJWT(userId: string, deviceId: string): Promise<string> {
    return jwt.sign(
      { userId: userId, deviceId: deviceId },
      settings.JWT_REFRESH_SECRET,
      {
        expiresIn: '1h',
      },
    );
  },

  /** getting user id by token from request headers */
  async verifyAccessToken(token: string) {
    try {
      return jwt.verify(token, settings.JWT_SECRET);
    } catch (error) {
      return null;
    }
  },
  async getUserIdFromAccessToken(accessToken: string) {
    return jwt.decode(accessToken, SETTINGS.JWT_SECRET);
  },
  async getRefreshTokenPayload(refreshToken: string) {
    try {
      return jwt.verify(refreshToken, settings.JWT_REFRESH_SECRET);
    } catch (error) {
      return null;
    }
  },
};
