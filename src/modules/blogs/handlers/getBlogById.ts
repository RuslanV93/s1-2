import { Response, Request, NextFunction } from 'express';
import { blogsRepository } from '../repositories/blogsRepository';
import { BlogType } from '../../../types/db.type';

import { blogRequestTypeParams } from '../types/blogsRequestResponseTypes';
import { STATUSES } from '../../../variables/statusVariables';

export const getBlogById = (
  req: Request<blogRequestTypeParams>,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;

  const blog: BlogType = blogsRepository.getBlogById(id);
  if (!blog) {
    res.sendStatus(STATUSES.NOT_FOUNT_404);
  }
  res.status(STATUSES.OK_200).send(blog);
  next();
};
