import { Request, Response } from 'express';
import { STATUSES } from '../../../common/variables/variables';
import { authService } from '../services/authService';

export const passwordRecovery = async (req: Request<{}, {}, {email: string}>, res: Response) => {
  const userEmail = req.body.email;
  const result = await authService.passwordRecovery(userEmail)
res.status(STATUSES.NO_CONTENT_204)
}