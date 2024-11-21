import { Response, Request } from 'express';
import { blogsRepository } from '../repositories/blogsRepository';

import { blogRequestTypeWithBodyAndParams } from '../types/blogsRequestResponseTypes';
import { STATUSES } from '../../../variables/variables';
import { BlogForUpdateType } from '../../../types/db.type';

export const updateBlog = async (
  req: Request<blogRequestTypeWithBodyAndParams>,
  res: Response,
) => {
  const updatedBlog: BlogForUpdateType = {
    id: req.params.id,
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl,
  };
  const blogForUpdate = await blogsRepository.getBlogById(req.params.id);
  if (!blogForUpdate) {
    res
      .status(STATUSES.NOT_FOUNT_404)
      .send('Blog not found. Incorrect blog id');
    return;
  }
  const result = await blogsRepository.updateBlogById(updatedBlog);
  if (!result) {
    res.status(500).send('Something went wrong.');

    return;
  }
  res.sendStatus(STATUSES.NO_CONTENT_204);
};
