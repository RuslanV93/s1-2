import { Request, Response } from 'express';
import { usersService } from '../services/usersService';
import { UserRequestWithParamsType } from '../types/usersRequestResponseTypes';
import { STATUSES } from '../../../variables/variables';
import { usersRepository } from '../repositories/usersRepository';
import { ObjectId } from 'mongodb';

export const deleteUser = async (
  req: Request<UserRequestWithParamsType>,
  res: Response,
) => {
  const userForDeleteId: ObjectId | null = await usersRepository.getUserById(
    new ObjectId(req.params.id),
  );
  if (!userForDeleteId) {
    res.status(STATUSES.NOT_FOUNT_404).send('User not Found!');
    return;
  }
  const deleteResult = await usersService.deleteUser(userForDeleteId);

  if (!deleteResult) {
    res.status(STATUSES.BAD_REQUEST_400).send('Something went wrong. User not deleted.');
    return;
  }
  res.sendStatus(STATUSES.NO_CONTENT_204);
};
