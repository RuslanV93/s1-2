import { Request, Response } from 'express';

import { blogRequestTypeBody } from '../types/blogsRequestResponseTypes';
import { STATUSES } from '../../../variables/variables';
import { responseObjectWithId } from '../../../helpers/responseObjectWithId';

import { blogsService } from '../services/blogsService';

export const addNewBlog = async (
  req: Request<{}, {}, blogRequestTypeBody>,
  res: Response,
) => {
  const newAddedBlog = await blogsService.addNewBlog(req.body);
  if (newAddedBlog) {
    res.status(STATUSES.CREATED_201).send(responseObjectWithId(newAddedBlog));
    return;
  }

  res.sendStatus(STATUSES.BAD_REQUEST_400);
};
