import { Request, Response } from 'express';
import { blogsRepository } from '../repositories/blogsRepository';

import { blogRequestTypeBody } from '../types/blogsRequestResponseTypes';
import { STATUSES } from '../../../variables/variables';
import { responseObjectWithId } from '../../../helpers/responseObjectWithId';
import { NewBlogType } from '../../../types/db.type';

export const addNewBlog = async (
  req: Request<{}, {}, blogRequestTypeBody>,
  res: Response,
) => {
  const newBlog: NewBlogType = {
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl,
    createdAt: new Date().toISOString(),
    isMembership: false,
  };

  const newAddedBlog = await blogsRepository.addNewBlog(newBlog);
  if (newAddedBlog) {
    res.status(STATUSES.CREATED_201).send(responseObjectWithId(newAddedBlog));
    return;
  }

  res.sendStatus(STATUSES.BAD_REQUEST_400);
};
