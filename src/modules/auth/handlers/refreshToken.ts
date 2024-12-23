import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { DomainStatusCode } from '../../../common/types/types';
import { resultCodeToHttpFunction } from '../../../common/helpers/resultCodeToHttpFunction';
import { jwtService } from '../../../common/crypto/jwtService';
import { STATUSES } from '../../../common/variables/variables';

/** Refresh token endpoint. Firstly validates token version against the current valid version.
 * Then gives back new token and updates the version in the database*/
export const refreshToken = async (req: Request, res: Response) => {
  const { userId, exp } = req.refreshTokenPayload;
  const verifyResult = await authService.verifyRefreshTokenVersion(userId, exp);

  if (verifyResult.status !== DomainStatusCode.Success) {
    res
      .status(resultCodeToHttpFunction(verifyResult.status))
      .send({ errorsMessages: verifyResult.extensions });
    return;
  }
  const newToken = await jwtService.createJWT(userId);
  const { refreshToken, tokenVersion } = await jwtService.refreshJWT(userId);
  const result = await authService.updateRefreshToken(userId, tokenVersion);
  if (result.status !== DomainStatusCode.Success) {
    res
      .status(resultCodeToHttpFunction(result.status))
      .send({ errorsMessages: result.extensions });
    return;
  }
  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
  res.status(STATUSES.OK_200).send({ accessToken: newToken });
};