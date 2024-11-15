import { Request, Response } from 'express';
import { postsRepository } from '../repositories/postsRepository';
import SETTINGS from '../../../settings';

export const deletePost = (req: Request<{ id: string }>, res: Response) => {
  postsRepository.deletePostById(req.params.id);
  res.sendStatus(SETTINGS.STATUSES.NO_CONTENT_204);
};
