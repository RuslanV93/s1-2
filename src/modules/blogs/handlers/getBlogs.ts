import { Request, Response } from 'express';
import { STATUSES } from '../../../variables/variables';
import { responseArrayWithId } from '../../../helpers/responseArrayWithId';
import { WithId } from 'mongodb';
import { BlogViewType } from '../../../types/db.type';
import { blogsService } from '../services/blogsService';
import { blogRequestTypeQuery } from '../types/blogsRequestResponseTypes';
import { getQueryFromRequest } from '../../../helpers/getQueryFromRequest';

export const getBlogs = async (
  req: Request<{}, blogRequestTypeQuery, blogRequestTypeQuery>,
  res: Response,
) => {
  const paginationParams: blogRequestTypeQuery = getQueryFromRequest(req);

  const blogs = await blogsService.getBlogs(paginationParams);
  res.status(STATUSES.OK_200).send(blogs);
};
