import { ObjectId, WithId } from 'mongodb';

export type DeviceDbType = WithId<{
  userId: ObjectId;
  ip: string;
  loginDate: number;
  lastActiveDate: number;
  title: string;
  deviceId: string;
  expiryDate: number;
}>;

export type NewDeviceType = {
  userId: ObjectId;
  ip: string;
  loginDate: number;
  lastActiveDate: number;
  title: string;
  deviceId: string;
  expiryDate: number;
};

export type DeviceViewType = {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
};
