import { Request, Response } from 'express';
import { getQueryFromRequest } from '../../../common/helpers/getQueryFromRequest';

import { STATUSES } from '../../../common/variables/variables';
import {
  commentsQueryRepository,
  commentsRepository,
} from '../../../infrastructure/compositionRoot';

export const getCommentsByPostId = async (req: Request, res: Response) => {
  const existingPost = await commentsRepository.findPost(req.params.id);

  if (!existingPost) {
    res.status(STATUSES.NOT_FOUND_404).send('Post not found.');
    return;
  }
  req.query.search = req.params.id;
  const paginationAndSearchParams = getQueryFromRequest.getQueryFromRequest(req);

  const comments = await commentsQueryRepository.getComments(
    paginationAndSearchParams,
  );
  res.status(STATUSES.OK_200).send(comments);
};
