import { Request, Response } from 'express';
import { postsRepository } from '../repositories/postsRepository';
import { getUniqueId } from '../../../helpers/getUniqueId';

import {
  NewPostType,
  postRequestTypeWithBody,
} from '../types/postsRequestResponseTypes';
import { blogsRepository } from '../../blogs/repositories/blogsRepository';
import { STATUSES } from '../../../variables/statusVariables';

export const addNewPost = (
  req: Request<{}, {}, postRequestTypeWithBody>,
  res: Response,
) => {
  const newPost: NewPostType = {
    id: getUniqueId(),
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    content: req.body.content,
    blogId: req.body.blogId,
    blogName: postsRepository.getBlogNameById(req.body.blogId),
  };
  const existingBlogToAddNewPost = blogsRepository.getBlogById(newPost.blogId);
  if (!existingBlogToAddNewPost) {
    res
      .status(STATUSES.BAD_REQUEST_400)
      .send('Blog not found. Incorrect blog ID');
  }
  const newAddedPost = postsRepository.addNewPost(newPost);
  if (!newAddedPost) {
    res.sendStatus(STATUSES.BAD_REQUEST_400);
    return;
  }
  res.status(STATUSES.CREATED_201).send(newAddedPost);
};
