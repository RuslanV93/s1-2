import { Response, Request } from 'express';
import { blogsRepository } from '../repositories/blogsRepository';
import { BlogType } from '../../../types/db.type';
import SETTINGS from '../../../settings';
export const updateBlog = (req: Request, res: Response) => {
  const updatedBlog: BlogType = {
    id: req.params.id,
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl,
  };
  blogsRepository.updateBlogById(req.params.id, updatedBlog);
  res.sendStatus(SETTINGS.STATUSES.NO_CONTENT_204);
};
