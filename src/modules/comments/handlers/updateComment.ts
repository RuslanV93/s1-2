import { Request, Response } from 'express';
import { commentsService } from '../services/commentsService';
import { DomainStatusCode } from '../../../common/types/types';
import { resultCodeToHttpFunction } from '../../../common/helpers/resultCodeToHttpFunction';
import { STATUSES } from '../../../common/variables/variables';

export const updateComment = async (req: Request, res: Response) => {
  const userId: string = req.user.id;
  const commentId: string = req.params.id;
  const commentNewText: string = req.body.content;

  const updateCommentResult = await commentsService.updateComment(
    userId,
    commentId,
    commentNewText,
  );
  if (updateCommentResult.status !== DomainStatusCode.Success) {
    res
      .status(resultCodeToHttpFunction(updateCommentResult.status))
      .send(updateCommentResult.extensions);
    return;
  }
  res.status(STATUSES.NO_CONTENT_204);
  return;
};
