import { Request, Response } from 'express';
import { AuthRequestTypeWithBody } from '../types/authRequestResponseTypes';
import { authService } from '../services/authService';
import { DomainStatusCode, ResultObject } from '../../../common/types/types';
import { resultCodeToHttpFunction } from '../../../common/helpers/resultCodeToHttpFunction';
import { STATUSES } from '../../../common/variables/variables';

function isSuccess(result: ResultObject<any>): result is ResultObject<string> {
  return result.status === DomainStatusCode.Success && result.data !== null;
}
/** User login. Giving access token and refresh token */
export const loginUser = async (
  req: Request<AuthRequestTypeWithBody>,
  res: Response,
) => {
  const title = `Platform: ${req.useragent?.platform || 'default'}, Browser: ${req.useragent?.browser || 'default'}`;
  const ip = Array.isArray(req.headers['x-forwarded-for'])
    ? req.headers['x-forwarded-for'][0]
    : req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'HELLO';
  const loginResult = await authService.loginUser(
    req.body.loginOrEmail,
    req.body.password,
    ip,
    title,
  );
  if (!isSuccess(loginResult)) {
    res
      .status(resultCodeToHttpFunction(loginResult.status))
      .send({ errorsMessages: loginResult.extensions });
    return;
  }
  const [accessToken, refreshToken] = loginResult.data;
  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
  res.status(STATUSES.OK_200).send({ accessToken: accessToken });
};
