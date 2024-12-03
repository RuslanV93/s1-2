import { Request, Response } from 'express';
import { STATUSES } from '../../../variables/variables';

import {
  BlogRequestTypeBody,
  BlogRequestTypeQuery,
} from '../types/blogsRequestResponseTypes';
import { getQueryFromRequest } from '../../../helpers/getQueryFromRequest';
import { blogsQueryRepository } from '../repositories/blogsQueryRepository';

export const getBlogs = async (req: Request<{}, BlogRequestTypeQuery>, res: Response) => {
  const paginationParams: BlogRequestTypeQuery =
    getQueryFromRequest.getBlogsOrPostsQueryFromRequest(req);

  const blogs = await blogsQueryRepository.getBlogs(paginationParams);
  res.status(STATUSES.OK_200).send(blogs);
};
