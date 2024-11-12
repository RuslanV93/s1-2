import { Request, Response, NextFunction } from 'express';
import { blogsRepository } from '../modules/blogs/repositories/blogsRepository';

export const objectContainValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;
  const object = req.baseUrl.split('/')[1];

  switch (object) {
    case 'blogs': {
      const blog = blogsRepository.getBlogById(id);
      if (!blog) {
        res.sendStatus(404);
        return;
      }
      next();
    }
  }
};
