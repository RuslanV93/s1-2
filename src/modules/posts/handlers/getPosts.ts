import { Request, Response } from 'express';
import { postsRepository } from '../repositories/postsRepository';
import { PostType } from '../../../types/db.type';
export const getPosts = (req: Request, res: Response) => {
  const posts: Array<PostType> = postsRepository.getPosts();
  res.status(200).send(posts);
};
