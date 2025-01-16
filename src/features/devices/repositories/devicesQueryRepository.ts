import { ObjectId } from 'mongodb';
import { DeviceDbType, DeviceViewType } from '../types/deviceTypes';
import { devicesViewModelMapper } from './devicesViewModelMapper';

import { Devices } from '../domain/devices.entity';

export const devicesQueryRepository = {
  /** Getting all devices(session) for current user. */
  async getAllDevices(userId: string): Promise<DeviceViewType[] | null> {
    const result: Array<DeviceDbType> = await Devices.find({
      userId: new ObjectId(userId),
    });
    if (!result) {
      return null;
    }

    return devicesViewModelMapper(result);
  },
};
