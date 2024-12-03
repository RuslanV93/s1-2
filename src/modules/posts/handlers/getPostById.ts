import { Request, Response } from 'express';
import { PostRequestTypeWithParams } from '../types/postsRequestResponseTypes';
import { STATUSES } from '../../../variables/variables';
import { postsQueryRepository } from '../repositories/postsQueryRepository';

import { PostViewType } from '../types/postsTypes';

export const getPostById = async (
  req: Request<PostRequestTypeWithParams>,
  res: Response,
) => {
  const id = req.params.id;
  const post: PostViewType | null = await postsQueryRepository.getPostById(id);

  if (!post) {
    res.sendStatus(STATUSES.NOT_FOUNT_404);
    return;
  }
  res.status(STATUSES.OK_200).send(post);
};
