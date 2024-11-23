import { Request, Response } from 'express';
import { blogsRepository } from '../repositories/blogsRepository';
import { blogRequestTypeParams } from '../types/blogsRequestResponseTypes';
import { STATUSES } from '../../../variables/variables';
import { blogsService } from '../services/blogsService';

export const deleteBlog = async (
  req: Request<blogRequestTypeParams>,
  res: Response,
) => {
  if (!(await blogsService.getBlogById(req.params.id))) {
    res.sendStatus(STATUSES.NOT_FOUNT_404);
    return;
  }
  const deleteResult = await blogsService.deleteBlogById(req.params.id);
  if (!deleteResult) {
    res.status(STATUSES.BAD_REQUEST_400).send('Something went wrong');
    return;
  }
  res.sendStatus(STATUSES.NO_CONTENT_204);
};
