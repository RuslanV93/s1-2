import { Router } from 'express';
import { getUsers } from './handlers/getUsers';
import {
  queryFieldsValidatorMiddleware,
  sortValidator,
} from '../../validators/queryValidators';
import { addNewUser } from './handlers/addNewUser';
import { deleteUser } from './handlers/deleteUser';
import { authValidatorMiddleware } from '../../validators/authValidator';
import {
  inputValidationMiddleware,
  userEmailValidator,
  userLoginValidator,
  userPasswordValidator,
  validateObjectId,
} from '../../validators/fieldsValidators';

export const usersRouter = Router();

export const usersController = {
  getUsers,
  addNewUser,
  deleteUser,
};

usersRouter.get(
  '/',
  authValidatorMiddleware,
  sortValidator,
  queryFieldsValidatorMiddleware,
  usersController.getUsers,
);
usersRouter.post(
  '/',
  authValidatorMiddleware,
  userLoginValidator,
  userPasswordValidator,
  userEmailValidator,
  inputValidationMiddleware,
  usersController.addNewUser,
);

usersRouter.delete(
  '/:id',
  authValidatorMiddleware,
  validateObjectId,
  inputValidationMiddleware,
  usersController.deleteUser,
);
