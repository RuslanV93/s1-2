import { Response, Request, NextFunction } from 'express';
import { blogsRepository } from '../repositories/blogsRepository';
import { BlogViewType } from '../../../types/db.type';

import { blogRequestTypeParams } from '../types/blogsRequestResponseTypes';
import { STATUSES } from '../../../variables/variables';
import { responseObjectWithId } from '../../../helpers/responseObjectWithId';
import { WithId } from 'mongodb';

export const getBlogById = async (
  req: Request<blogRequestTypeParams>,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;

  const blog: WithId<BlogViewType> | null =
    await blogsRepository.getBlogById(id);

  if (blog) {
    console.log(blog);
    res.status(STATUSES.OK_200).send(responseObjectWithId(blog));
    return;
  }
  res.sendStatus(STATUSES.NOT_FOUNT_404);
};
