import { Response, Request } from 'express';
import { blogsRepository } from '../repositories/blogsRepository';
import { BlogType } from '../../../types/db.type';

import { blogRequestTypeWithBodyAndParams } from '../types/blogsRequestResponseTypes';
import { STATUSES } from '../../../variables/statusVariables';

export const updateBlog = (
  req: Request<blogRequestTypeWithBodyAndParams>,
  res: Response,
) => {
  const updatedBlog: BlogType = {
    id: req.params.id,
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl,
  };
  const blogForUpdate = blogsRepository.getBlogById(req.params.id);
  if (!blogForUpdate) {
    res
      .status(STATUSES.NOT_FOUNT_404)
      .send('Blog not found. Incorrect blog id');
  }
  blogsRepository.updateBlogById(updatedBlog);
  res.sendStatus(STATUSES.NO_CONTENT_204);
};
