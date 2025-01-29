import { Router } from 'express';
import {
  queryFieldsValidatorMiddleware,
  sortValidator,
} from '../../validators/queryValidators';
import { authValidatorMiddleware } from '../../validators/authValidator';
import {
  inputValidationMiddleware,
  userEmailValidator,
  userLoginValidator,
  userPasswordValidator,
  validateObjectId,
} from '../../validators/fieldsValidators';
import { usersController } from '../../ioc/compositionRoot';

export const usersRouter = Router();

usersRouter.get(
  '/',
  authValidatorMiddleware,
  sortValidator,
  queryFieldsValidatorMiddleware,
  usersController.getUsers.bind(usersController),
);
usersRouter.post(
  '/',
  authValidatorMiddleware,
  userLoginValidator,
  userPasswordValidator,
  userEmailValidator,
  inputValidationMiddleware,
  usersController.addNewUser.bind(usersController),
);

usersRouter.delete(
  '/:id',
  authValidatorMiddleware,
  validateObjectId,
  inputValidationMiddleware,
  usersController.deleteUser.bind(usersController),
);
