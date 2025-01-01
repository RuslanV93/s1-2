import { DeviceDbType, DeviceViewType } from '../types/deviceTypes';

export const devicesViewModelMapper = (dbDevices: Array<DeviceDbType>) => {
  const mappedDevices: Array<DeviceViewType> = dbDevices.map((device) => {
    return {
      deviceId: device.deviceId,
      ip: device.ip,
      lastActiveDate: new Date(device.lastActiveDate).toISOString(),
      title: device.title,
    };
  });
  return mappedDevices;
};
