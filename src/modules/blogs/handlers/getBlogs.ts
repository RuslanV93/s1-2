import { Request, Response } from 'express';
import { STATUSES } from '../../../common/variables/variables';

import {
  BlogRequestTypeBody,
  BlogRequestTypeQuery,
} from '../types/blogsRequestResponseTypes';
import { getQueryFromRequest } from '../../../common/helpers/getQueryFromRequest';
import { blogsQueryRepository } from '../repositories/blogsQueryRepository';
import { sendEmailAdapter } from '../../auth/adapters/sendEmailAdapter';

export const getBlogs = async (req: Request<{}, BlogRequestTypeQuery>, res: Response) => {
  const paginationAndSearchParams: BlogRequestTypeQuery =
    getQueryFromRequest.getQueryFromRequest(req);

  const blogs = await blogsQueryRepository.getBlogs(paginationAndSearchParams);
  res.status(STATUSES.OK_200).send(blogs);
};
