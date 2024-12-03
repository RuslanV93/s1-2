import { Request, Response } from 'express';
import { blogsRepository } from '../repositories/blogsRepository';
import { BlogRequestTypeParams } from '../types/blogsRequestResponseTypes';
import { STATUSES } from '../../../variables/variables';
import { blogsService } from '../services/blogsService';
import { ObjectId } from 'mongodb';

export const deleteBlog = async (req: Request<BlogRequestTypeParams>, res: Response) => {
  // checking is blog exists
  const existingBlog = await blogsRepository.getBlogById(new ObjectId(req.params.id));
  if (!existingBlog) {
    res.sendStatus(STATUSES.NOT_FOUNT_404);
    return;
  }
  // getting delete result (success or not)
  const deleteResult = await blogsService.deleteBlogById(req.params.id);
  if (!deleteResult) {
    res.status(STATUSES.BAD_REQUEST_400).send('Something went wrong');
    return;
  }
  res.sendStatus(STATUSES.NO_CONTENT_204);
};
