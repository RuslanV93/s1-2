import { Request, Response } from 'express';

import { usersService } from '../services/usersService';
import { STATUSES } from '../../../variables/variables';
import { UserRequestTypeWithBody } from '../types/usersRequestResponseTypes';
import { ObjectId } from 'mongodb';
import { usersQueryRepository } from '../repositories/usersQueryRepository';

export const addNewUser = async (
  req: Request<{}, {}, UserRequestTypeWithBody>,
  res: Response,
) => {
  try {
    const newAddedUserId: string | null = await usersService.addNewUser(req);

    if (!newAddedUserId) {
      console.log('not new user');
      res.sendStatus(STATUSES.BAD_REQUEST_400);
      return;
    }
    const newAddedUser = await usersQueryRepository.getUserById(newAddedUserId);
    res.status(201).send(newAddedUser);
    return;
  } catch (error: any) {
    if (error.errorsMessages) {
      res.status(400).send(error);
    }
  }
};
