import { Request, Response } from 'express';
import { AuthRequestTypeWithBody } from '../types/authRequestResponseTypes';
import { authService } from '../services/authService';
import { STATUSES } from '../../../variables/variables';

export const loginUser = async (req: Request<AuthRequestTypeWithBody>, res: Response) => {
  try {
    const user = await authService.loginUser(req.body.loginOrEmail, req.body.password);
    const token = await authService.createJWT(user);
    res.status(STATUSES.OK_200).send({ accessToken: token });
    return;
  } catch (error: any) {
    res.status(STATUSES.UNAUTHORIZED_401).send(error.errorsMessages);
    return;
  }
};
