import { Request, Response } from 'express';
import { STATUSES } from '../../../variables/variables';
import { usersQueryRepository } from '../../users/repositories/usersQueryRepository';

export const authMe = async (req: Request, res: Response) => {
  const userId: string = req.user.id;
  if (!userId) {
    res.sendStatus(STATUSES.UNAUTHORIZED_401);
    return;
  }
  const me = await usersQueryRepository.findMe(userId);
  res.status(STATUSES.OK_200).send(me);
};
