import { Request, Response } from 'express';
import { STATUSES } from '../../../common/variables/variables';

import { getQueryFromRequest } from '../../../common/helpers/getQueryFromRequest';
import { PostRequestTypeQuery } from '../types/postsRequestResponseTypes';
import { postsQueryRepository } from '../repositories/postsQueryRepository';

export const getPosts = async (req: Request<{}, PostRequestTypeQuery>, res: Response) => {
  const paginationParams: PostRequestTypeQuery =
    getQueryFromRequest.getQueryFromRequest(req);
  const posts = await postsQueryRepository.getPosts(paginationParams);
  res.status(STATUSES.OK_200).send(posts);
};
