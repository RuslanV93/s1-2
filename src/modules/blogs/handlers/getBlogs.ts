import { blogsRepository } from '../repositories/blogsRepository';
import { Request, Response } from 'express';
export const getBlogs = (req: Request, res: Response): void => {
  const blogs = blogsRepository.getBlogs();
  res.status(200).send(blogs);
};
