import { Request, Response } from 'express';
import { postRequestTypeWithBody } from '../types/postsRequestResponseTypes';
import { STATUSES } from '../../../variables/variables';
import { responseObjectWithId } from '../../../helpers/responseObjectWithId';
import { blogsService } from '../../blogs/services/blogsService';
import { postsService } from '../services/postsService';

export const addNewPost = async (
  req: Request<{}, {}, postRequestTypeWithBody>,
  res: Response,
) => {
  const existingBlogToAddNewPost = await blogsService.getBlogById(
    req.body.blogId,
  );
  if (!existingBlogToAddNewPost) {
    res
      .status(STATUSES.BAD_REQUEST_400)
      .send('Blog not found. Incorrect blog ID');
    return;
  }
  const newAddedPost = await postsService.addNewPost(
    req,
    existingBlogToAddNewPost.name,
  );
  if (!newAddedPost) {
    res.sendStatus(STATUSES.BAD_REQUEST_400);
    return;
  }
  res.status(STATUSES.CREATED_201).send(responseObjectWithId(newAddedPost));
};
