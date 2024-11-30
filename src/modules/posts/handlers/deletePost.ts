import { Request, Response } from 'express';
import { postsRepository } from '../repositories/postsRepository';

import { postRequestTypeWithParams } from '../types/postsRequestResponseTypes';
import { STATUSES } from '../../../variables/variables';
import { postsService } from '../services/postsService';
import { ObjectId } from 'mongodb';

export const deletePost = async (
  req: Request<postRequestTypeWithParams>,
  res: Response,
) => {
  const postForDelete = await postsRepository.getPostById(new ObjectId(req.params.id));

  if (!postForDelete) {
    res.status(STATUSES.NOT_FOUNT_404).send('Post not found. Incorrect ID');
    return;
  }
  const deleteResult = await postsService.deletePostById(req.params.id);

  if (!deleteResult) {
    res.status(500).send('Something went wrong');
    return;
  }
  res.sendStatus(STATUSES.NO_CONTENT_204);
};
