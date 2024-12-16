import { Request, Response } from 'express';
import { commentsService } from '../services/commentsService';
import { CommentsRequestWithParamsType } from '../types/commentsResponseRequestTypes';
import { STATUSES } from '../../../common/variables/variables';

export const deleteComment = async (
  req: Request<CommentsRequestWithParamsType>,
  res: Response,
) => {
  const commentId: string = req.params.id;
  const userId: string = req.user.id;
  const deleteCommentResult = await commentsService.deleteComment(commentId, userId);

  switch (deleteCommentResult.status) {
    case 0: {
      res.sendStatus(STATUSES.NO_CONTENT_204);
      return;
    }
    case 1: {
      res.status(STATUSES.NOT_FOUNT_404).send(deleteCommentResult.extensions);
      return;
    }
    case 2: {
      res.status(STATUSES.FORBIDDEN_403).send(deleteCommentResult.extensions);
      return;
    }
    case 5: {
      res.status(STATUSES.INTERNAL_ERROR_500).send(deleteCommentResult.extensions);
    }
  }
};
