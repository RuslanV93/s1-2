import { Request, Response } from 'express';
import { getQueryFromRequest } from '../../../helpers/getQueryFromRequest';
import { STATUSES } from '../../../variables/variables';
import { BlogRequestTypeQuery } from '../types/blogsRequestResponseTypes';

import { blogsQueryRepository } from '../repositories/blogsQueryRepository';
import { ObjectId } from 'mongodb';
import { PostRequestTypeWithParams } from '../../posts/types/postsRequestResponseTypes';

export const getPostsByBlogId = async (
  req: Request<PostRequestTypeWithParams>,
  res: Response,
) => {
  const paginationAndSearchParams: BlogRequestTypeQuery =
    getQueryFromRequest.getBlogsOrPostsQueryFromRequest(req);
  const blog = await blogsQueryRepository.getBlogById(req.params.id);

  if (!blog) {
    res.status(STATUSES.NOT_FOUNT_404).send('Blog not found. Incorrect Blog Id.');
    return;
  }
  const postsByBlogId = await blogsQueryRepository.getPostsByBlogId(
    req.params.id,
    paginationAndSearchParams,
  );

  res.status(STATUSES.OK_200).send(postsByBlogId);
};
