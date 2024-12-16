import { Request, Response } from 'express';
import { PostRequestTypeWithBody } from '../types/postsRequestResponseTypes';
import { STATUSES } from '../../../common/variables/variables';
import { postsService } from '../services/postsService';
import { ObjectId } from 'mongodb';
import { blogsRepository } from '../../blogs/repositories/blogsRepository';
import { postsQueryRepository } from '../repositories/postsQueryRepository';

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
  // getting new added post id for request and check is post added
  const newAddedPostId = await postsService.addNewPost(
    req.body,
    existingBlogToAddNewPost.name,
  );
  if (!newAddedPostId) {
    res.sendStatus(STATUSES.BAD_REQUEST_400);
    return;
  }
  const newAddedPost = await postsQueryRepository.getPostById(newAddedPostId);
  if (!newAddedPost) {
    res.sendStatus(STATUSES.BAD_REQUEST_400);
    return;
  }
  res.status(STATUSES.CREATED_201).send(newAddedPost);
};
