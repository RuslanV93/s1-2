import { Request, Response } from 'express';
import { STATUSES } from '../../../common/variables/variables';
import { usersQueryRepository } from '../../../ioc/compositionRoot';

export const authMe = async (req: Request, res: Response) => {
  const userId: string = req.user.id;
  if (!userId) {
    res.sendStatus(STATUSES.UNAUTHORIZED_401);
    return;
  }
  const me = await usersQueryRepository.findMe(userId);
  if (!me) {
    res.sendStatus(STATUSES.UNAUTHORIZED_401);
    return;
  }
  res.status(STATUSES.OK_200).send(me);
};
