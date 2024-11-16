import { Request, Response } from 'express';
import { postsRepository } from '../repositories/postsRepository';
import { PostType } from '../../../types/db.type';
import { STATUSES } from '../../../variables/statusVariables';

export const getPosts = (req: Request, res: Response) => {
  const posts: Array<PostType> = postsRepository.getPosts();
  res.status(STATUSES.OK_200).send(posts);
};
