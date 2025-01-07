import { DeviceDbType, NewDeviceType } from '../types/deviceTypes';
import { jwtService } from '../../../common/crypto/jwtService';
import { devicesRepository } from '../repositories/devicesRepository';
import { DomainStatusCode, ResultObject } from '../../../common/types/types';
import { ObjectId } from 'mongodb';
import { randomUUID } from 'node:crypto';
import { resultObject } from '../../../common/helpers/resultObjectHelpers';

export const devicesService = {
  async findSession(deviceId: string) {
    const session = await devicesRepository.findDevice(deviceId);
    if (!session) {
      return resultObject.errorResultObject('Unauthorized', {
        message: 'Unauthorized',
      });
    }
    return resultObject.successResultObject<DeviceDbType>(session);
  },

  /** Creating new device session after user login */
  async createDevice(
    userId: string,
    ip: string,
    title: string,
  ): Promise<ResultObject<string | null>> {
    const deviceId: string = randomUUID();
    const refreshToken = await jwtService.createRefreshJWT(userId, deviceId);
    const refreshTokenPayload =
      await jwtService.getRefreshTokenPayload(refreshToken);

    const device: NewDeviceType = {
      userId: new ObjectId(userId),
      ip,
      title,
      lastActiveDate: new Date().getTime(),
      deviceId,
      loginDate: new Date().getTime(),
      expiryDate: refreshTokenPayload.exp,
    };
    const newDeviceId: string | null = await devicesRepository.createDevice(device);
    if (!newDeviceId) {
      return {
        status: DomainStatusCode.InternalServerError,
        data: null,
        extensions: [{ message: 'Something went wrong.' }],
      };
    }
    return {
      status: DomainStatusCode.Success,
      data: refreshToken,
      extensions: [],
    };
  },

  /** Terminate all device sessions except the current */
  async terminateOtherDevices(userId: string, deviceId: string) {
    const terminateResult: number | null =
      await devicesRepository.terminateOtherDevices(userId, deviceId);
    if (!terminateResult || terminateResult < 1) {
      return {
        status: DomainStatusCode.InternalServerError,
        data: null,
        extensions: [{ message: 'Something went wrong.' }],
      };
    }
    return {
      status: DomainStatusCode.Success,
      data: null,
      extensions: [],
    };
  },

  async deleteDeviceById(deviceId: string, userId: string) {
    const deviceToDelete = await devicesRepository.findDevice(deviceId);
    if (!deviceToDelete) {
      return {
        status: DomainStatusCode.NotFound,
        data: null,
        extensions: [{ message: 'Device not found.' }],
      };
    }
    if (deviceToDelete.userId.toString() !== userId) {
      return {
        status: DomainStatusCode.Forbidden,
        data: null,
        extensions: [
          { message: "The session doesn't belong to a user with that ID" },
        ],
      };
    }
    const deleteResult = await devicesRepository.deleteDeviceById(deviceId);
    if (!deleteResult || deleteResult < 1) {
      return {
        status: DomainStatusCode.InternalServerError,
        data: null,
        extensions: [{ message: 'Something went wrong.' }],
      };
    }
    return {
      status: DomainStatusCode.Success,
      data: null,
      extensions: [],
    };
  },
};
