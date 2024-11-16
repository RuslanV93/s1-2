import { Request, Response } from 'express';
import { blogsRepository } from '../repositories/blogsRepository';
import { blogRequestTypeParams } from '../types/blogsRequestResponseTypes';
import { STATUSES } from '../../../variables/statusVariables';

export const deleteBlog = (
  req: Request<blogRequestTypeParams>,
  res: Response,
) => {
  if (!blogsRepository.getBlogById(req.params.id)) {
    res.sendStatus(STATUSES.NOT_FOUNT_404);
  }
  blogsRepository.deleteBlogById(req.params.id);
  res.sendStatus(STATUSES.NO_CONTENT_204);
};
