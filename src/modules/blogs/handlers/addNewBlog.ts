import { Request, Response } from 'express';
import { blogsRepository } from '../repositories/blogsRepository';
import { BlogType } from '../../../types/db.type';
import { getUniqueId } from '../../../helpers/getUniqueId';

import { blogRequestTypeBody } from '../types/blogsRequestResponseTypes';
import { STATUSES } from '../../../variables/statusVariables';

export const addNewBlog = (
  req: Request<{}, {}, blogRequestTypeBody>,
  res: Response,
) => {
  const newBlog: BlogType = {
    id: getUniqueId(),
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl,
  };

  const newAddedBlog = blogsRepository.addNewBlog(newBlog);
  if (!newAddedBlog) {
    res.sendStatus(STATUSES.BAD_REQUEST_400);
  }
  res.status(STATUSES.CREATED_201).send(newAddedBlog);
};
