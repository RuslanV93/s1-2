import { Router } from 'express';
import {
  confirmationCodeValidator,
  inputValidationMiddleware,
  userEmailValidator,
  userLoginValidator,
  userPasswordValidator,
} from '../../validators/fieldsValidators';
import { loginUser } from './handlers/loginUser';
import { authMe } from './handlers/authMe';
import {
  accessTokenValidator,
  refreshTokenValidator,
} from '../../validators/authValidator';
import { userRegistration } from './handlers/userRegistration';
import { registrationConfirmation } from './handlers/registrationConfirmation';
import { emailResending } from './handlers/emailResending';
import { refreshToken } from './handlers/refreshToken';
import { logout } from './handlers/logout';
import { requestControl } from '../../validators/requestControl';
import { passwordRecovery } from './handlers/passwordRecovery';

export const authRouter = Router();

const authController = {
  loginUser,
  authMe,
  userRegistration,
  registrationConfirmation,
  emailResending,
  refreshToken,
  logout,
  passwordRecovery,
};

authRouter.post(
  '/login',
  requestControl,
  userPasswordValidator,
  userEmailValidator,
  userLoginValidator,
  inputValidationMiddleware,
  authController.loginUser,
);
authRouter.post(
  '/refresh-token',
  refreshTokenValidator,
  authController.refreshToken,
);
authRouter.post('/logout', refreshTokenValidator, authController.logout);
authRouter.post(
  '/registration',
  requestControl,
  userLoginValidator,
  userPasswordValidator,
  userEmailValidator,
  inputValidationMiddleware,
  authController.userRegistration,
);
authRouter.post(
  '/registration-confirmation',
  requestControl,
  confirmationCodeValidator,
  inputValidationMiddleware,
  authController.registrationConfirmation,
);
authRouter.post(
  '/registration-email-resending',
  requestControl,
  userEmailValidator,
  inputValidationMiddleware,
  authController.emailResending,
);
authRouter.get('/me', accessTokenValidator, authController.authMe);

authRouter.post('/password-recovery', requestControl, userEmailValidator, authController.passwordRecovery);