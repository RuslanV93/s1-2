import { Request, Response } from 'express';
import { blogsRepository } from '../repositories/blogsRepository';
import SETTINGS from '../../../settings';
export const deleteBlog = (req: Request, res: Response) => {
  if (!blogsRepository.getBlogById(req.params.id)) {
    res.sendStatus(SETTINGS.STATUSES.NOT_FOUNT_404);
  }
  blogsRepository.deleteBlogById(req.params.id);
  res.sendStatus(SETTINGS.STATUSES.NO_CONTENT_204);
};
