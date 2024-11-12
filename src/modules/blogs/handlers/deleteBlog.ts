import { Request, Response } from 'express';
import { blogsRepository } from '../repositories/blogsRepository';
export const deleteBlog = (req: Request, res: Response) => {
  blogsRepository.deleteBlogById(req.params.id);
  res.sendStatus(204);
};
