import { blogsService } from '../services/blogsService';
import { Request, Response } from 'express';
import { getQueryFromRequest } from '../../../helpers/getQueryFromRequest';
import { STATUSES } from '../../../variables/variables';
import { blogRequestTypeQuery } from '../types/blogsRequestResponseTypes';

import { blogsQueryRepository } from '../repositories/blogsQueryRepository';
import { ObjectId } from 'mongodb';

export const getPostsByBlogId = async (req: Request, res: Response) => {
  const paginationAndSearchParams: blogRequestTypeQuery = getQueryFromRequest(req);
  const blog = await blogsQueryRepository.getBlogById(req.params.id);

  if (!blog) {
    res.status(STATUSES.NOT_FOUNT_404).send('Blog not found. Incorrect Blog Id.');
    return;
  }
  const postsByBlogId = await blogsQueryRepository.getPostsByBlogId(
    new ObjectId(req.params.id),
    paginationAndSearchParams,
  );

  res.status(STATUSES.OK_200).send(postsByBlogId);
};
