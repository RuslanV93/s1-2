import { Request, Response } from 'express';
import { PostRequestTypeWithBody } from '../types/postsRequestResponseTypes';
import { STATUSES } from '../../../variables/variables';

import { postsService } from '../services/postsService';
import { ObjectId } from 'mongodb';
import { blogsRepository } from '../../blogs/repositories/blogsRepository';

import { PostViewType } from '../types/postsTypes';

export const addNewPost = async (
  req: Request<{}, {}, PostRequestTypeWithBody>,
  res: Response,
) => {
  const existingBlogToAddNewPost = await blogsRepository.getBlogById(
    new ObjectId(req.body.blogId),
  );
  if (!existingBlogToAddNewPost) {
    res.status(STATUSES.BAD_REQUEST_400).send('Blog not found. Incorrect blog ID');
    return;
  }
  const newAddedPost: PostViewType | null = await postsService.addNewPost(
    req,
    existingBlogToAddNewPost.name,
  );
  if (!newAddedPost) {
    res.sendStatus(STATUSES.BAD_REQUEST_400);
    return;
  }
  res.status(STATUSES.CREATED_201).send(newAddedPost);
};
