import { Response, Request } from 'express';
import { blogsRepository } from '../repositories/blogsRepository';

import { blogRequestTypeWithBodyAndParams } from '../types/blogsRequestResponseTypes';
import { STATUSES } from '../../../variables/variables';

import { blogsService } from '../services/blogsService';

export const updateBlog = async (
  req: Request<blogRequestTypeWithBodyAndParams>,
  res: Response,
) => {
  const blogForUpdate = await blogsService.getBlogById(req.params.id);
  if (!blogForUpdate) {
    res
      .status(STATUSES.NOT_FOUNT_404)
      .send('Blog not found. Incorrect blog id');
    return;
  }
  const result = await blogsService.updateBlog(req);
  if (!result) {
    res.status(500).send('Something went wrong.');

    return;
  }
  res.sendStatus(STATUSES.NO_CONTENT_204);
};
