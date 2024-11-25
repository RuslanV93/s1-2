import { blogsService } from '../services/blogsService';
import { Request, Response } from 'express';
import { getQueryFromRequest } from '../../../helpers/getQueryFromRequest';
import { STATUSES } from '../../../variables/variables';
export const getPostsByBlogId = async (req: Request, res: Response) => {
  const paginationParams = getQueryFromRequest(req);
  const blog = await blogsService.getBlogById(req.params.id);
  if (!blog) {
    res.sendStatus(STATUSES.NOT_FOUNT_404);
    return;
  }
  const postsByBlogId = await blogsService.getPostsByBlogId(
    req.params.id,
    paginationParams,
  );

  res.status(STATUSES.OK_200).send(postsByBlogId);
};
