import { Request, Response } from 'express';
import { STATUSES } from '../../../variables/variables';

import { postsService } from '../services/postsService';
import { getQueryFromRequest } from '../../../helpers/getQueryFromRequest';
import { postRequestTypeQuery } from '../types/postsRequestResponseTypes';

export const getPosts = async (req: Request, res: Response) => {
  const paginationParams: postRequestTypeQuery = getQueryFromRequest(req);
  const posts = await postsService.getPosts(paginationParams);
  res.status(STATUSES.OK_200).send(posts);
};
