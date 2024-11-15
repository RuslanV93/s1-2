import { NextFunction, Request, Response } from 'express';
import { blogsRepository } from '../modules/blogs/repositories/blogsRepository';
import { postsRepository } from '../modules/posts/repositories/postsRepository';

export const findObjectById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const path = req.baseUrl.slice(1);
  if (path === 'blogs') {
    const blog = blogsRepository.getBlogById(req.params.id);
    if (!blog) {
      res.sendStatus(404);
    }
  }
  if (path === 'posts') {
    const post = postsRepository.getPostById(req.params.id);
    if (!post) {
      res.sendStatus(404);
    }
  }
  next();
};
