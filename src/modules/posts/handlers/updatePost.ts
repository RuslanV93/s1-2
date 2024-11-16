import { Request, Response } from 'express';
import { postsRepository } from '../repositories/postsRepository';

import {
  NewPostType,
  postRequestTypeWithBody,
  postRequestTypeWithParams,
} from '../types/postsRequestResponseTypes';
import { blogsRepository } from '../../blogs/repositories/blogsRepository';
import { STATUSES } from '../../../variables/statusVariables';

export const updatePost = (
  req: Request<postRequestTypeWithParams, {}, postRequestTypeWithBody>,
  res: Response,
) => {
  const updatedPost: NewPostType = {
    id: req.params.id,
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    content: req.body.content,
    blogId: req.body.blogId,
    blogName:
      req.body.blogName || postsRepository.getBlogNameById(req.body.blogId),
  };
  const blogForUpdate = blogsRepository.getBlogById(updatedPost.blogId);
  if (!blogForUpdate) {
    res
      .status(STATUSES.BAD_REQUEST_400)
      .send('Blog not exists. Incorrect blog ID');
  }
  const postForUpdate = postsRepository.getPostById(req.params.id);
  if (!postForUpdate) {
    res
      .status(STATUSES.NOT_FOUNT_404)
      .send('Post not found. Incorrect post ID');
  }
  postsRepository.updatePostById(updatedPost);
  res.sendStatus(STATUSES.NO_CONTENT_204);
};
