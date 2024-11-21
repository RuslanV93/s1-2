import { Request, Response } from 'express';
import { postsRepository } from '../repositories/postsRepository';
import { postRequestTypeWithBody } from '../types/postsRequestResponseTypes';
import { blogsRepository } from '../../blogs/repositories/blogsRepository';
import { STATUSES } from '../../../variables/variables';
import { responseObjectWithId } from '../../../helpers/responseObjectWithId';
import { NewPostType } from '../../../types/db.type';

export const addNewPost = async (
  req: Request<{}, {}, postRequestTypeWithBody>,
  res: Response,
) => {
  const existingBlogToAddNewPost = await blogsRepository.getBlogById(
    req.body.blogId,
  );
  if (!existingBlogToAddNewPost) {
    res
      .status(STATUSES.BAD_REQUEST_400)
      .send('Blog not found. Incorrect blog ID');
    return;
  }
  const newPost: NewPostType = {
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    content: req.body.content,
    blogId: req.body.blogId,
    blogName: await postsRepository.getBlogNameById(req.body.blogId),
    createdAt: new Date().toISOString(),
  };
  const newAddedPost = await postsRepository.addNewPost(newPost);
  if (!newAddedPost) {
    res.sendStatus(STATUSES.BAD_REQUEST_400);
    return;
  }
  res.status(STATUSES.CREATED_201).send(responseObjectWithId(newAddedPost));
};
