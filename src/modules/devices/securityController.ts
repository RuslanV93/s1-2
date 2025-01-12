import { Router } from 'express';
import { getDevices } from './handlers/getDevices';
import {
  refreshTokenValidator,
} from '../../validators/authValidator';
import { terminateOtherDevices } from './handlers/terminateOtherDevices';
import { deleteDeviceById } from './handlers/deleteDeviceById';

export const securityRouter = Router();

const securityController = {
  getDevices: getDevices,
  deleteDevices: terminateOtherDevices,
  deleteDeviceById: deleteDeviceById,
};

securityRouter.get('/devices', refreshTokenValidator, securityController.getDevices);

securityRouter.delete(
  '/devices',
  refreshTokenValidator,
  securityController.deleteDevices,
);

securityRouter.delete(
  '/devices/:deviceId',
  refreshTokenValidator,
  securityController.deleteDeviceById,
);
