import { Request, Response } from 'express';
import { usersQueryRepository } from '../repositories/usersQueryRepository';
import { getQueryFromRequest } from '../../../helpers/getQueryFromRequest';
import { UserRequestWithQueryType } from '../types/usersRequestResponseTypes';

export const getUsers = async (
  req: Request<{}, UserRequestWithQueryType>,
  res: Response,
) => {
  const searchAndPaginationParams = getQueryFromRequest.getUsersQueryFromRequest(req);
  const users = await usersQueryRepository.getUsers(searchAndPaginationParams);
  res.status(200).send(users);
};
