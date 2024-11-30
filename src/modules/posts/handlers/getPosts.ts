import { Request, Response } from 'express';
import { STATUSES } from '../../../variables/variables';

import { postsService } from '../services/postsService';
import { getQueryFromRequest } from '../../../helpers/getQueryFromRequest';
import { postRequestTypeQuery } from '../types/postsRequestResponseTypes';
import { postsQueryRepository } from '../repositories/postsQueryRepository';

export const getPosts = async (req: Request, res: Response) => {
  const paginationParams: postRequestTypeQuery = getQueryFromRequest(req);
  const posts = await postsQueryRepository.getPosts(paginationParams);
  res.status(STATUSES.OK_200).send(posts);
};
