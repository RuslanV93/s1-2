import { Request, Response } from 'express';
import { postsRepository } from '../repositories/postsRepository';

import { PostRequestTypeWithParams } from '../types/postsRequestResponseTypes';
import { STATUSES } from '../../../common/variables/variables';
import { postsService } from '../services/postsService';
import { ObjectId } from 'mongodb';

export const deletePost = async (
  req: Request<PostRequestTypeWithParams>,
  res: Response,
) => {
  const postForDelete = await postsRepository.getPostById(
    new ObjectId(req.params.id),
  );

  if (!postForDelete) {
    res.status(STATUSES.NOT_FOUND_404).send('Post not found. Incorrect ID');
    return;
  }
  const deleteResult = await postsService.deletePostById(postForDelete._id);

  if (!deleteResult) {
    res.status(500).send('Something went wrong');
    return;
  }
  res.sendStatus(STATUSES.NO_CONTENT_204);
};
