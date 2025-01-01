import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { DomainStatusCode } from '../../../common/types/types';
import { resultCodeToHttpFunction } from '../../../common/helpers/resultCodeToHttpFunction';
import { STATUSES } from '../../../common/variables/variables';

export const logout = async (req: Request, res: Response) => {
  const { userId, deviceId, exp } = req.refreshTokenPayload;

  const verifyTokenResult = await authService.verifyRefreshTokenVersion(
    deviceId,
    exp,
  );
  if (verifyTokenResult.status !== DomainStatusCode.Success) {
    res
      .status(resultCodeToHttpFunction(verifyTokenResult.status))
      .send({ errorsMessages: verifyTokenResult.extensions });
    return;
  }
  const logoutResult = await authService.logout(deviceId);
  if (logoutResult.status !== DomainStatusCode.Success) {
    res
      .status(resultCodeToHttpFunction(logoutResult.status))
      .send({ errorsMessages: logoutResult.extensions });
    return;
  }
  res.clearCookie('refreshToken');
  res.sendStatus(STATUSES.NO_CONTENT_204);
};
