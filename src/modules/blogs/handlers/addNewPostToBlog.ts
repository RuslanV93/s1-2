import { Request, Response } from 'express';
import { STATUSES } from '../../../variables/variables';

import { blogsService } from '../services/blogsService';
import { ObjectId } from 'mongodb';
import { blogsRepository } from '../repositories/blogsRepository';
import { postsRepository } from '../../posts/repositories/postsRepository';
import { BlogViewType } from '../../../types/db.type';

export const addNewPostToBlog = async (req: Request, res: Response) => {
  const blogToAddPost: BlogViewType | null = await blogsRepository.getBlogById(
    new ObjectId(req.params.id),
  );

  if (!blogToAddPost) {
    res.sendStatus(STATUSES.NOT_FOUNT_404);
    return;
  }
  // Getting new post id after adding to DB
  const newPostId: ObjectId | null = await blogsService.addNewPostToBlog(
    req.body,
    blogToAddPost,
  );
  if (!newPostId) {
    res.sendStatus(STATUSES.BAD_REQUEST_400);
    return;
  }
  // Getting new post to response him
  const newPost = await postsRepository.getPostById(newPostId);
  if (!newPost) {
    res.status(STATUSES.NOT_FOUNT_404).send('Post not found.');
  }
  res.status(STATUSES.CREATED_201).send(newPost);
};
