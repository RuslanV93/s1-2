import { Request, Response } from 'express';
import { postsRepository } from '../repositories/postsRepository';
import { PostType } from '../../../types/db.type';
import SETTINGS from '../../../settings';
export const getPosts = (req: Request, res: Response) => {
  const posts: Array<PostType> = postsRepository.getPosts();
  res.status(SETTINGS.STATUSES.OK_200).send(posts);
};
