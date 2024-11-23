import { Request, Response } from 'express';
import {
  postRequestTypeWithBody,
  postRequestTypeWithParams,
} from '../types/postsRequestResponseTypes';
import { STATUSES } from '../../../variables/variables';
import { blogsService } from '../../blogs/services/blogsService';
import { postsService } from '../services/postsService';

export const updatePost = async (
  req: Request<postRequestTypeWithParams, {}, postRequestTypeWithBody>,
  res: Response,
) => {
  const blogForUpdate = await blogsService.getBlogById(req.body.blogId);
  if (!blogForUpdate) {
    res
      .status(STATUSES.BAD_REQUEST_400)
      .send('Blog not exists. Incorrect blog ID');
    return;
  }
  const postForUpdate = postsService.getPostById(req.params.id);
  if (!postForUpdate) {
    res
      .status(STATUSES.NOT_FOUNT_404)
      .send('Post not found. Incorrect post ID');
    return;
  }

  const updateResult = await postsService.updatePost(req, blogForUpdate.name);
  if (!updateResult) {
    res.sendStatus(404);
    return;
  }
  res.sendStatus(STATUSES.NO_CONTENT_204);
};
