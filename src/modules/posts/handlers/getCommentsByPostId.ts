import { Request, Response } from 'express';
import { commentsQueryRepository } from '../../comments/repositories/commentsQueryRepository';
import { getQueryFromRequest } from '../../../common/helpers/getQueryFromRequest';

import { commentsRepository } from '../../comments/repositories/commentsRepository';
import { STATUSES } from '../../../common/variables/variables';

export const getCommentsByPostId = async (req: Request, res: Response) => {
  const existingPost = await commentsRepository.findPost(req.params.id);

  if (!existingPost) {
    res.status(STATUSES.NOT_FOUNT_404).send('Post not found.');
    return;
  }
  req.query.search = req.params.id;
  const paginationAndSearchParams = getQueryFromRequest.getQueryFromRequest(req);

  const comments = await commentsQueryRepository.getComments(paginationAndSearchParams);
  res.status(STATUSES.OK_200).send(comments);
};
