import { Request, Response } from 'express';
import { devicesQueryRepository } from '../repositories/devicesQueryRepository';
import { STATUSES } from '../../../common/variables/variables';
import { DeviceViewType } from '../types/deviceTypes';
export const getDevices = async (req: Request, res: Response) => {
  const { userId } = req.refreshTokenPayload;
  const devices: DeviceViewType[] | null =
    await devicesQueryRepository.getAllDevices(userId);
  if (!devices) {
    res.status(STATUSES.INTERNAL_ERROR_500).send('Something went wrong');
    return;
  }
  res.status(STATUSES.OK_200).send(devices);
};
