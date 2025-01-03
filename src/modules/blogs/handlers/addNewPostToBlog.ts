import { Request, Response } from 'express';
import { STATUSES } from '../../../common/variables/variables';
import { blogsService } from '../services/blogsService';
import { ObjectId } from 'mongodb';
import { blogsRepository } from '../repositories/blogsRepository';

import { BlogDbType } from '../types/blogsTypes';
import {
  BlogRequestTypeParams,
  PostByBlogRequestTypeBody,
} from '../types/blogsRequestResponseTypes';
import { postsQueryRepository } from '../../posts/repositories/postsQueryRepository';
import { postsService } from '../../posts/services/postsService';

export const addNewPostToBlog = async (
  req: Request<BlogRequestTypeParams, {}, PostByBlogRequestTypeBody>,
  res: Response,
) => {
  const blogToAddPost: BlogDbType | null = await blogsRepository.getBlogById(
    new ObjectId(req.params.id),
  );

  if (!blogToAddPost) {
    res.sendStatus(STATUSES.NOT_FOUNT_404);
    return;
  }
  // Getting new post id after adding to DB
  const newPostId: string | null = await postsService.addNewPostToBlog(
    req.body,
    blogToAddPost,
  );
  if (!newPostId) {
    res.sendStatus(STATUSES.BAD_REQUEST_400);
    return;
  }
  // Getting new post to response him
  const newPost = await postsQueryRepository.getPostById(newPostId);
  if (!newPost) {
    res.status(STATUSES.NOT_FOUNT_404).send('Post not found.');
  }
  res.status(STATUSES.CREATED_201).send(newPost);
};
