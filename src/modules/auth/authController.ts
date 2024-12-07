import { Request, Response, Router } from 'express';
import {
  inputValidationMiddleware,
  userEmailValidator,
  userLoginValidator,
  userPasswordValidator,
} from '../../validators/fieldsValidators';
import { loginUser } from './handlers/loginUser';
import { authMe } from './handlers/authMe';

import { accessTokenValidator } from '../../validators/authValidator';
export const authRouter = Router();

const authController = {
  loginUser,
  authMe,
};

authRouter.post(
  '/login',
  userPasswordValidator,
  userEmailValidator,
  userLoginValidator,
  inputValidationMiddleware,
  authController.loginUser,
);

authRouter.get('/me', accessTokenValidator, authController.authMe);
