import { Request, Response } from 'express';
import { postsRepository } from '../repositories/postsRepository';
import { PostType } from '../../../types/db.type';
import SETTINGS from '../../../settings';

export const getPostById = (req: Request, res: Response) => {
  const id = req.params.id;
  const post: PostType = postsRepository.getPostById(id);

  if (!post) {
    res.sendStatus(SETTINGS.STATUSES.NOT_FOUNT_404);
  }
  res.status(SETTINGS.STATUSES.OK_200).send(post);
};
