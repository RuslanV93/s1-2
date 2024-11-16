import { blogsRepository } from '../repositories/blogsRepository';
import { Request, Response } from 'express';
import { STATUSES } from '../../../variables/statusVariables';

export const getBlogs = (req: Request, res: Response): void => {
  const blogs = blogsRepository.getBlogs();
  res.status(STATUSES.OK_200).send(blogs);
};
