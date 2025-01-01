import { devicesCollection } from '../../../db/db';
import { ObjectId } from 'mongodb';
import { DeviceDbType, DeviceViewType } from '../types/deviceTypes';
import { devicesViewModelMapper } from '../features/devicesViewModelMapper';

export const devicesQueryRepository = {
  /** Getting all devices(session) for current user. */
  async getAllDevices(userId: string): Promise<DeviceViewType[] | null> {
    const result: Array<DeviceDbType> = await devicesCollection
      .find({ userId: new ObjectId(userId) })
      .toArray();
    if (!result) {
      return null;
    }

    return devicesViewModelMapper(result);
  },
};
