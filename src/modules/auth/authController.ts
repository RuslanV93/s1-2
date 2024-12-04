import { Router } from 'express';
import { Request, Response } from 'express';

import { authService } from './services/authService';
import { STATUSES } from '../../variables/variables';
import { AuthRequestTypeWithBody } from './types/authRequestResponseTypes';
import {
  inputValidationMiddleware,
  userEmailValidator,
  userLoginValidator,
  userPasswordValidator,
} from '../../validators/fieldsValidators';
export const authRouter = Router();

const authController = {
  async loginUser(req: Request<AuthRequestTypeWithBody>, res: Response) {
    try {
      await authService.loginUser(req.body.loginOrEmail, req.body.password);

      res.sendStatus(STATUSES.NO_CONTENT_204);
      return;
    } catch (error: any) {
      res.status(STATUSES.UNAUTHORIZED_401).send(error.errorsMessages);
      return;
    }
  },
};

authRouter.post(
  '/login',
  userPasswordValidator,
  userEmailValidator,
  userLoginValidator,
  inputValidationMiddleware,
  authController.loginUser,
);
