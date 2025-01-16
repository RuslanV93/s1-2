import { DeviceDbType, NewDeviceType } from '../types/deviceTypes';
import { ObjectId } from 'mongodb';
import { Devices } from '../domain/devices.entity';

export const devicesRepository = {
  async findDevice(deviceId: string): Promise<DeviceDbType | null> {
    const device: DeviceDbType | null = await Devices.findOne({
      deviceId: deviceId,
    }).exec();
    if (!device) {
      return null;
    }
    return device;
  },
  /** Create new session */
  async createDevice(device: NewDeviceType): Promise<string | null> {
    try {
      const newDevice = new Devices(device);
      const savedDevice = await newDevice.save();
      return savedDevice._id.toString();
    } catch (error) {
      return null;
    }

    // const result = await devicesCollection.insertOne(device);
    // if (!result) {
    //   return null;
    // }
    // return result.insertedId.toString();
  },

  /** Update refresh token in database */
  async updateDeviceSession(deviceId: string, expiryDate: number, issuedAt: number) {
    return await Devices.findOneAndUpdate(
      { deviceId },
      {
        lastActiveDate: issuedAt,
        expiryDate: expiryDate,
      },
      { new: true }, // вернет обновленный документ
    ).exec();
    // const result = await devicesCollection.findOneAndUpdate(
    //   { deviceId: deviceId },
    //   {
    //     $set: { lastActiveDate: issuedAt, expiryDate: expiryDate },
    //   },
    //   {
    //     returnDocument: 'after',
    //   },
    // );
    // if (!result) {
    //   return null;
    // }
    // return result;
  },

  /** Getting token exp date for verifying is token expired */
  async getDeviceSessionTokenExpDate(deviceId: string): Promise<string | null> {
    const result = await Devices.findOne({ deviceId: deviceId });
    if (!result) {
      return null;
    }

    return result.expiryDate.toString();
  },

  /** Delete(Terminate) all devices sessions, except current session */
  async terminateOtherDevices(userId: string, deviceId: string) {
    const result = await Devices.deleteMany({
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
    const result = await Devices.deleteOne({
      deviceId: deviceId,
    });
    if (!result) {
      return null;
    }
    return result.deletedCount;
  },
};
