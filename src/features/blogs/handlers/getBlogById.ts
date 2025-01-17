import { Response, Request } from 'express';
import { BlogRequestTypeParams } from '../types/blogsRequestResponseTypes';
import { STATUSES } from '../../../common/variables/variables';
import { blogsQueryRepository } from '../repositories/blogsQueryRepository';

import { BlogViewType } from '../types/blogsTypes';

export const getBlogById = async (
  req: Request<BlogRequestTypeParams>,
  res: Response,
) => {
  const id = req.params.id;

  const blog: BlogViewType | null = await blogsQueryRepository.getBlogById(id);
  if (!blog) {
    res.sendStatus(STATUSES.NOT_FOUND_404);
    return;
  }

  res.status(STATUSES.OK_200).send(blog);
};
