import { Request, Response } from 'express';
import { STATUSES } from '../../../variables/variables';
import { responseObjectWithId } from '../../../helpers/responseObjectWithId';
import { blogsService } from '../services/blogsService';
export const addNewPostToBlog = async (req: Request, res: Response) => {
  const blogToAddPost = await blogsService.getBlogById(req.params.id);

  if (!blogToAddPost) {
    res.sendStatus(STATUSES.NOT_FOUNT_404);
    return;
  }
  const newPost = await blogsService.addNewPostToBlog(req.body, req.params.id);
  if (!newPost) {
    res.sendStatus(STATUSES.BAD_REQUEST_400);
    return;
  }
  res.status(STATUSES.CREATED_201).send(responseObjectWithId(newPost));
};
