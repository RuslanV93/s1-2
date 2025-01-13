import { Request, Response } from 'express';
import { NewPasswordTypeWithBody } from '../types/authRequestResponseTypes';
import { authService } from '../services/authService';
import { DomainStatusCode } from '../../../common/types/types';
import { resultCodeToHttpFunction } from '../../../common/helpers/resultCodeToHttpFunction';
import { STATUSES } from '../../../common/variables/variables';

export const setNewPassword = async (
  req: Request<{}, {}, NewPasswordTypeWithBody>,
  res: Response,
) => {
  const result = await authService.confirmPasswordRecovery(
    req.body.newPassword,
    req.body.recoveryCode,
  );
  if (result.status !== DomainStatusCode.Success) {
    res
      .status(resultCodeToHttpFunction(result.status))
      .send({ errorsMessages: result.extensions });
    return;
  }
  res.sendStatus(STATUSES.NO_CONTENT_204);
};
