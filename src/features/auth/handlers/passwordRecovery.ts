import { Request, Response } from 'express';
import { STATUSES } from '../../../common/variables/variables';
import { authService } from '../services/authService';
import { DomainStatusCode } from '../../../common/types/types';
import { resultCodeToHttpFunction } from '../../../common/helpers/resultCodeToHttpFunction';

export const passwordRecovery = async (
  req: Request<{}, {}, { email: string }>,
  res: Response,
) => {
  const userEmail = req.body.email;
  const result = await authService.passwordRecovery(userEmail);
  if (
    result.status !== DomainStatusCode.Success &&
    result.status !== DomainStatusCode.NotFound
  ) {
    res
      .status(resultCodeToHttpFunction(result.status))
      .send({ errorsMessages: result.extensions });
    return;
  }
  res.sendStatus(STATUSES.NO_CONTENT_204);
};
