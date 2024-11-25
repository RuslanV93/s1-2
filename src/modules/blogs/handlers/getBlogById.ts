import { Response, Request, NextFunction } from 'express';
import { blogRequestTypeParams } from '../types/blogsRequestResponseTypes';
import { STATUSES } from '../../../variables/variables';
import { responseObjectWithId } from '../../../helpers/responseObjectWithId';
import { blogsService } from '../services/blogsService';

export const getBlogById = async (
  req: Request<blogRequestTypeParams>,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;

  const blog = await blogsService.getBlogById(id);

  if (blog) {
    res.status(STATUSES.OK_200).send(responseObjectWithId(blog));
    return;
  }
  res.sendStatus(STATUSES.NOT_FOUNT_404);
};
