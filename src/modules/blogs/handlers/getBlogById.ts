import { Response, Request, NextFunction } from 'express';
import { blogsRepository } from '../repositories/blogsRepository';
import { BlogType } from '../../../types/db.type';

export const getBlogById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;

  const blog: BlogType = blogsRepository.getBlogById(id);
  if (!blog) {
    res.sendStatus(404);
  }
  res.status(200).send(blog);
  next();
};
