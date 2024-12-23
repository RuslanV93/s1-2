import { Request, Response } from 'express';
import { AuthRequestTypeWithBody } from '../types/authRequestResponseTypes';
import { authService } from '../services/authService';
import { STATUSES } from '../../../common/variables/variables';
import { jwtService } from '../../../common/crypto/jwtService';
import { resultCodeToHttpFunction } from '../../../common/helpers/resultCodeToHttpFunction';
import { DomainStatusCode } from '../../../common/types/types';

/** User login. Giving access token and refresh token */
export const loginUser = async (
  req: Request<AuthRequestTypeWithBody>,
  res: Response,
) => {
  try {
    const user = await authService.loginUser(
      req.body.loginOrEmail,
      req.body.password,
    );
    const token = await jwtService.createJWT(user._id.toString());
    const { refreshToken, tokenVersion } = await jwtService.refreshJWT(
      user._id.toString(),
    );
    const refreshTokenUpdateResult = await authService.updateRefreshToken(
      user._id.toString(),
      tokenVersion,
    );
    if (refreshTokenUpdateResult.status !== DomainStatusCode.Success) {
      res
        .status(resultCodeToHttpFunction(refreshTokenUpdateResult.status))
        .send({ errorsMessages: refreshTokenUpdateResult.extensions });
    }
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    res.status(STATUSES.OK_200).send({ accessToken: token });
    return;
  } catch (error: any) {
    res.status(STATUSES.UNAUTHORIZED_401).send(error.errorsMessages);
    return;
  }
};
