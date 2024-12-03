import { Request, Response } from 'express';
import { BlogRequestTypeBody } from '../types/blogsRequestResponseTypes';
import { STATUSES } from '../../../variables/variables';
import { blogsService } from '../services/blogsService';
import { ObjectId } from 'mongodb';
import { blogsRepository } from '../repositories/blogsRepository';

export const addNewBlog = async (
  req: Request<{}, {}, BlogRequestTypeBody>,
  res: Response,
) => {
  const addedBlogId: ObjectId | null = await blogsService.addNewBlog(req.body);

  if (!addedBlogId) {
    res.sendStatus(STATUSES.BAD_REQUEST_400);
    return;
  }
  const newAddedBlog = await blogsRepository.getBlogById(addedBlogId);

  if (!newAddedBlog) {
    res.status(STATUSES.NOT_FOUNT_404).send('Blog not found.');
    return;
  }

  res.status(STATUSES.CREATED_201).send(newAddedBlog);
};
