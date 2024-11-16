import { Request, Response } from 'express';
import { postsRepository } from '../repositories/postsRepository';

import { postRequestTypeWithParams } from '../types/postsRequestResponseTypes';
import { STATUSES } from '../../../variables/statusVariables';

export const deletePost = (
  req: Request<postRequestTypeWithParams>,
  res: Response,
) => {
  const postForDelete = postsRepository.getPostById(req.params.id);
  if (!postForDelete) {
    res.status(STATUSES.NOT_FOUNT_404).send('Post not found. Incorrect ID');
  }
  postsRepository.deletePostById(req.params.id);
  res.sendStatus(STATUSES.NO_CONTENT_204);
};
