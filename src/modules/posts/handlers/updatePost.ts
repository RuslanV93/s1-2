import { Request, Response } from 'express';
import {
  PostRequestTypeWithBody,
  PostRequestTypeWithParams,
} from '../types/postsRequestResponseTypes';
import { STATUSES } from '../../../variables/variables';
import { postsService } from '../services/postsService';
import { postsRepository } from '../repositories/postsRepository';
import { blogsRepository } from '../../blogs/repositories/blogsRepository';
import { ObjectId } from 'mongodb';

export const updatePost = async (
  req: Request<PostRequestTypeWithParams, {}, PostRequestTypeWithBody>,
  res: Response,
) => {
  const blogForUpdate = await blogsRepository.getBlogById(new ObjectId(req.body.blogId));

  if (!blogForUpdate) {
    res.status(STATUSES.BAD_REQUEST_400).send('Blog not exists. Incorrect blog ID!');
    return;
  }

  const postToUpdate = await postsRepository.getPostById(new ObjectId(req.params.id));

  if (!postToUpdate) {
    res.status(STATUSES.NOT_FOUNT_404).send('Posts not exists. Incorrect post ID!');
    return;
  }

  const updatedResult = await postsService.updatePost(
    req.body,
    req.params.id,
    blogForUpdate.name,
  );

  if (!updatedResult) {
    res.sendStatus(STATUSES.NOT_FOUNT_404);
    return;
  }
  res.sendStatus(STATUSES.NO_CONTENT_204);
};
