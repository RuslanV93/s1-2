import { Response, Request } from 'express';
import { BlogRequestTypeWithBodyAndParams } from '../types/blogsRequestResponseTypes';
import { STATUSES } from '../../../common/variables/variables';
import { blogsService } from '../services/blogsService';
import { ObjectId } from 'mongodb';
import { blogsRepository } from '../repositories/blogsRepository';

export const updateBlog = async (
  req: Request<BlogRequestTypeWithBodyAndParams>,
  res: Response,
) => {
  const blogForUpdate = await blogsRepository.getBlogById(new ObjectId(req.params.id));
  if (!blogForUpdate) {
    res.status(STATUSES.NOT_FOUNT_404).send('Blog not found. Incorrect blog id');
    return;
  }
  const result = await blogsService.updateBlog(new ObjectId(req.params.id), req.body);
  if (!result) {
    res.status(500).send('Something went wrong.');

    return;
  }
  res.sendStatus(STATUSES.NO_CONTENT_204);
};
