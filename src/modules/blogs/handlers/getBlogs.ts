import { Request, Response } from 'express';
import { STATUSES } from '../../../variables/variables';

import {
  blogRequestTypeBody,
  blogRequestTypeQuery,
} from '../types/blogsRequestResponseTypes';
import { getQueryFromRequest } from '../../../helpers/getQueryFromRequest';
import { blogsQueryRepository } from '../repositories/blogsQueryRepository';

export const getBlogs = async (
  req: Request<{}, blogRequestTypeQuery, blogRequestTypeBody>,
  res: Response,
) => {
  const paginationParams: blogRequestTypeQuery = getQueryFromRequest(req);

  const blogs = await blogsQueryRepository.getBlogs(paginationParams);
  res.status(STATUSES.OK_200).send(blogs);
};
