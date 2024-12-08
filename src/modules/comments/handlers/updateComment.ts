import { Request, Response } from 'express';
import { commentsService } from '../services/commentsService';
import { STATUSES } from '../../../variables/variables';

export const updateComment = async (req: Request, res: Response) => {
  const userId: string = req.user.id;
  const commentId: string = req.params.id;
  const commentNewText: string = req.body.content;

  const updateCommentResult = await commentsService.updateComment(
    userId,
    commentId,
    commentNewText,
  );
  switch (updateCommentResult.status) {
    case 0: {
      res.status(STATUSES.NO_CONTENT_204).send(updateCommentResult.extensions);
      return;
    }
    case 1: {
      res.status(STATUSES.NOT_FOUNT_404).send(updateCommentResult.extensions);
      return;
    }
    case 2: {
      res.status(STATUSES.FORBIDDEN_403).send(updateCommentResult.extensions);
      return;
    }
    case 5: {
      res.status(STATUSES.INTERNAL_ERROR_500).send(updateCommentResult.extensions);
    }
  }
};
