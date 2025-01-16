import mongoose from 'mongoose';
import { DeviceDbType } from '../types/deviceTypes';
import { DEVICE_CONTROL } from '../../../common/variables/variables';

const devicesSchema = new mongoose.Schema<DeviceDbType>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    ip: { type: String, required: true },
    loginDate: { type: Number, required: true },
    lastActiveDate: { type: Number, required: true },
    title: { type: String, required: true },
    deviceId: { type: String, required: true },
    expiryDate: { type: Number, required: true },
  },
  {
    collection: DEVICE_CONTROL.devices,
    versionKey: false,
  },
);
export const Devices = mongoose.model<DeviceDbType>('Devices', devicesSchema);