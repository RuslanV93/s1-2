import { Request, Response } from 'express';
import { blogsRepository } from '../repositories/blogsRepository';
import { blogRequestTypeParams } from '../types/blogsRequestResponseTypes';
import { STATUSES } from '../../../variables/variables';

export const deleteBlog = async (
  req: Request<blogRequestTypeParams>,
  res: Response,
) => {
  if (!(await blogsRepository.getBlogById(req.params.id))) {
    res.sendStatus(STATUSES.NOT_FOUNT_404);
    return;
  }
  const deleteResult = await blogsRepository.deleteBlogById(req.params.id);
  if (!deleteResult) {
    res.status(STATUSES.BAD_REQUEST_400).send('Something went wrong');
    return;
  }
  res.sendStatus(STATUSES.NO_CONTENT_204);
};
