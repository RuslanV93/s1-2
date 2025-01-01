import { DeviceDbType, NewDeviceType } from '../types/deviceTypes';
import { devicesCollection } from '../../../db/db';
import { ObjectId } from 'mongodb';

export const devicesRepository = {
  async findDevice(deviceId: string): Promise<DeviceDbType | null> {
    const device = await devicesCollection.findOne({ deviceId: deviceId });
    if (!device) {
      return null;
    }
    return device;
  },
  /** Create new session */
  async createDevice(device: NewDeviceType): Promise<string | null> {
    const result = await devicesCollection.insertOne(device);
    if (!result) {
      return null;
    }
    return result.insertedId.toString();
  },

  /** Update refresh token in database */
  async updateDeviceSession(deviceId: string, expiryDate: number, issuedAt: number) {
    const result = await devicesCollection.findOneAndUpdate(
      { deviceId: deviceId },
      {
        $set: { lastActiveDate: issuedAt, expiryDate: expiryDate },
      },
      {
        returnDocument: 'after',
      },
    );
    if (!result) {
      return null;
    }
    return result;
  },

  /** Getting token exp date for verifying is token expired */
  async getDeviceSessionTokenExpDate(deviceId: string): Promise<string | null> {
    const result = await devicesCollection.findOne({ deviceId: deviceId });
    if (!result) {
      return null;
    }

    return result.expiryDate.toString();
  },
  /** Delete session by deviceId*/
  async deleteDeviceSession(deviceId: string): Promise<number | null> {
    const result = await devicesCollection.deleteOne({ deviceId: deviceId });
    if (!result) {
      return null;
    }
    return result.deletedCount;
  },
  /** Delete(Terminate) all devices sessions, except current session */
  async terminateOtherDevices(userId: string, deviceId: string) {
    const result = await devicesCollection.deleteMany({
      userId: new ObjectId(userId),
      deviceId: { $ne: deviceId },
    });
    if (!result) {
      return null;
    }
    return result.deletedCount;
  },

  /** Delete session by device ID*/
  async deleteDeviceById(deviceId: string): Promise<number | null> {
    const result = await devicesCollection.deleteOne({
      deviceId: deviceId,
    });
    if (!result) {
      return null;
    }
    return result.deletedCount;
  },
};
