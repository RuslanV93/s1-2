import { Request, Response } from 'express';
import { devicesService } from '../services/devicesService';
import { DomainStatusCode } from '../../../common/types/types';
import { resultCodeToHttpFunction } from '../../../common/helpers/resultCodeToHttpFunction';
import { STATUSES } from '../../../common/variables/variables';

export const deleteDeviceById = async (
  req: Request<{ deviceId: string }>,
  res: Response,
) => {
  const refreshTokenPayload = req.refreshTokenPayload;
  const toDeleteDeviceId = req.params.deviceId;

  const deleteResult = await devicesService.deleteDeviceById(
    toDeleteDeviceId,
    refreshTokenPayload.userId,
  );
  if (deleteResult.status !== DomainStatusCode.Success) {
    res
      .status(resultCodeToHttpFunction(deleteResult.status))
      .send(deleteResult.extensions);
    return;
  }
  res.sendStatus(STATUSES.NO_CONTENT_204);
};
