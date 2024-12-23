import { Request, Response } from 'express';
import { commentsService } from '../services/commentsService';
import { CommentsRequestWithParamsType } from '../types/commentsResponseRequestTypes';
import { STATUSES } from '../../../common/variables/variables';
import { DomainStatusCode } from '../../../common/types/types';
import { resultCodeToHttpFunction } from '../../../common/helpers/resultCodeToHttpFunction';

export const deleteComment = async (
  req: Request<CommentsRequestWithParamsType>,
  res: Response,
) => {
  const commentId: string = req.params.id;
  const userId: string = req.user.id;
  const deleteCommentResult = await commentsService.deleteComment(commentId, userId);
  if (deleteCommentResult.status !== DomainStatusCode.Success) {
    res
      .status(resultCodeToHttpFunction(deleteCommentResult.status))
      .send(deleteCommentResult.extensions);
    return;
  }
  res.sendStatus(STATUSES.NO_CONTENT_204);
};
