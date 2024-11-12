import { Request, Response } from 'express';
import { postsRepository } from '../repositories/postsRepository';
import { PostType } from '../../../types/db.type';

export const getPostById = (req: Request, res: Response) => {
  const id = req.params.id;
  const post: PostType = postsRepository.getPostById(id);

  if (!post) {
    res.sendStatus(404);
  }
  res.status(200).send(post);
};
