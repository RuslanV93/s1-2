import { Request, Response } from 'express';
import { STATUSES } from '../../../variables/variables';

import {
  BlogRequestTypeBody,
  BlogRequestTypeQuery,
} from '../types/blogsRequestResponseTypes';
import { getQueryFromRequest } from '../../../helpers/getQueryFromRequest';
import { blogsQueryRepository } from '../repositories/blogsQueryRepository';

export const getBlogs = async (req: Request<{}, BlogRequestTypeQuery>, res: Response) => {
  const paginationAndSearchParams: BlogRequestTypeQuery =
    getQueryFromRequest.getBlogsOrPostsQueryFromRequest(req);

  const blogs = await blogsQueryRepository.getBlogs(paginationAndSearchParams);
  res.status(STATUSES.OK_200).send(blogs);
};
