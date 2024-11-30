import { Response, Request, NextFunction } from 'express';
import { blogRequestTypeParams } from '../types/blogsRequestResponseTypes';
import { STATUSES } from '../../../variables/variables';
import { blogsQueryRepository } from '../repositories/blogsQueryRepository';
import { BlogViewType } from '../../../types/db.type';

export const getBlogById = async (
  req: Request<blogRequestTypeParams>,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;

  const blog: BlogViewType | null = await blogsQueryRepository.getBlogById(id);
  if (!blog) {
    res.sendStatus(STATUSES.NOT_FOUNT_404);
    return;
  }

  res.status(STATUSES.OK_200).send(blog);
};
