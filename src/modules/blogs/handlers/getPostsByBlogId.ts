import { Request, Response } from 'express';
import { getQueryFromRequest } from '../../../helpers/getQueryFromRequest';
import { STATUSES } from '../../../variables/variables';
import { BlogRequestTypeQuery } from '../types/blogsRequestResponseTypes';

import { blogsQueryRepository } from '../repositories/blogsQueryRepository';
import { ObjectId } from 'mongodb';
import { PostRequestTypeWithParams } from '../../posts/types/postsRequestResponseTypes';
import { blogsRepository } from '../repositories/blogsRepository';
import { postsQueryRepository } from '../../posts/repositories/postsQueryRepository';

export const getPostsByBlogId = async (
  req: Request<PostRequestTypeWithParams>,
  res: Response,
) => {
  const paginationAndSearchParams: BlogRequestTypeQuery =
    getQueryFromRequest.getQueryFromRequest(req);
  const blog = await blogsRepository.getBlogById(new ObjectId(req.params.id));

  if (!blog) {
    res.status(STATUSES.NOT_FOUNT_404).send('Blog not found. Incorrect Blog Id.');
    return;
  }
  const postsByBlogId = await postsQueryRepository.getPosts(
    paginationAndSearchParams,
    req.params.id,
  );

  res.status(STATUSES.OK_200).send(postsByBlogId);
};
