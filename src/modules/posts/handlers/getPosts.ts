import { Request, Response } from 'express';
import { STATUSES } from '../../../variables/variables';
import { responseArrayWithId } from '../../../helpers/responseArrayWithId';
import { PostViewType } from '../../../types/db.type';
import { WithId } from 'mongodb';
import { postsService } from '../services/postsService';

export const getPosts = async (req: Request, res: Response) => {
  const posts: Array<WithId<PostViewType>> = await postsService.getPosts();

  res.status(STATUSES.OK_200).send(responseArrayWithId(posts));
};
