import { Request, Response } from 'express';
import { postsRepository } from '../repositories/postsRepository';
import { PostType } from '../../../types/db.type';

import { postRequestTypeWithParams } from '../types/postsRequestResponseTypes';
import { STATUSES } from '../../../variables/statusVariables';

export const getPostById = (
  req: Request<postRequestTypeWithParams>,
  res: Response,
) => {
  const id = req.params.id;
  const post: PostType = postsRepository.getPostById(id);

  if (!post) {
    res.sendStatus(STATUSES.NOT_FOUNT_404);
  }
  res.status(STATUSES.OK_200).send(post);
};
