import { Response, Request, NextFunction } from 'express';
import { blogsRepository } from '../repositories/blogsRepository';
import { BlogType } from '../../../types/db.type';
import SETTINGS from '../../../settings';

export const getBlogById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;

  const blog: BlogType = blogsRepository.getBlogById(id);
  if (!blog) {
    res.sendStatus(SETTINGS.STATUSES.NOT_FOUNT_404);
  }
  res.status(SETTINGS.STATUSES.OK_200).send(blog);
  next();
};
