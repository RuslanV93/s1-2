import { blogsRepository } from '../repositories/blogsRepository';
import { Request, Response } from 'express';
import SETTINGS from '../../../settings';
export const getBlogs = (req: Request, res: Response): void => {
  const blogs = blogsRepository.getBlogs();
  res.status(SETTINGS.STATUSES.OK_200).send(blogs);
};
