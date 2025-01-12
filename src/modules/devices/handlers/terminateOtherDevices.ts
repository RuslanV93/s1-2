import { Request, Response } from 'express';
import { DomainStatusCode, ResultObject } from '../../../common/types/types';
import { devicesService } from '../services/devicesService';
import { STATUSES } from '../../../common/variables/variables';

export const terminateOtherDevices = async (req: Request, res: Response) => {
  const { userId, deviceId } = req.userContext;
  const terminateResult: ResultObject<null> =
    await devicesService.terminateOtherDevices(userId, deviceId);

  if (terminateResult.status !== DomainStatusCode.Success) {
    res.status(STATUSES.INTERNAL_ERROR_500).send('Something went wrong.');
    return;
  }
  res.sendStatus(STATUSES.NO_CONTENT_204);
};
