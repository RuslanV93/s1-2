import { Request, Response } from 'express';

import { usersService } from '../services/usersService';
import { STATUSES } from '../../../variables/variables';
import { UserRequestTypeWithBody } from '../types/usersRequestResponseTypes';

export const addNewUser = async (
  req: Request<{}, {}, UserRequestTypeWithBody>,
  res: Response,
) => {
  try {
    const newAddedUser = await usersService.addNewUser(req);

    if (!newAddedUser) {
      console.log('not new user');
      res.sendStatus(STATUSES.BAD_REQUEST_400);
      return;
    }
    res.status(201).send(newAddedUser);
    return;
  } catch (error: any) {
    if (error.errorsMessages) {
      res.status(400).send(error);
    }
  }
};
