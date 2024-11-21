import { Request, Response } from 'express';
import { postsRepository } from '../repositories/postsRepository';

import {
  postRequestTypeWithBody,
  postRequestTypeWithParams,
} from '../types/postsRequestResponseTypes';
import { blogsRepository } from '../../blogs/repositories/blogsRepository';
import { STATUSES } from '../../../variables/variables';
import { PostForUpdateType } from '../../../types/db.type';

export const updatePost = async (
  req: Request<postRequestTypeWithParams, {}, postRequestTypeWithBody>,
  res: Response,
) => {
  const blogForUpdate = blogsRepository.getBlogById(req.body.blogId);
  if (!blogForUpdate) {
    res
      .status(STATUSES.BAD_REQUEST_400)
      .send('Blog not exists. Incorrect blog ID');
    return;
  }
  const postForUpdate = postsRepository.getPostById(req.params.id);
  if (!postForUpdate) {
    res
      .status(STATUSES.NOT_FOUNT_404)
      .send('Post not found. Incorrect post ID');
    return;
  }
  const updatedPost: PostForUpdateType = {
    id: req.params.id,
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    content: req.body.content,
    blogId: req.body.blogId,
    blogName:
      req.body.blogName ||
      (await postsRepository.getBlogNameById(req.body.blogId)),
  };
  const updateResult = await postsRepository.updatePostById(updatedPost);
  if (!updateResult) {
    res.sendStatus(404);
    return;
  }
  res.sendStatus(STATUSES.NO_CONTENT_204);
};
