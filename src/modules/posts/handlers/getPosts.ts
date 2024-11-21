import { Request, Response } from 'express';
import { postsRepository } from '../repositories/postsRepository';
import { STATUSES } from '../../../variables/variables';
import { responseArrayWithId } from '../../../helpers/responseArrayWithId';
import { PostViewType } from '../../../types/db.type';
import { WithId } from 'mongodb';

export const getPosts = async (req: Request, res: Response) => {
  const posts: Array<WithId<PostViewType>> = await postsRepository.getPosts();
  console.log(posts);
  res.status(STATUSES.OK_200).send(responseArrayWithId(posts));
};
//
