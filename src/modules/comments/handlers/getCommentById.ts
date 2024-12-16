import { Request, Response } from 'express';
import { CommentsRequestWithParamsType } from '../types/commentsResponseRequestTypes';
import { CommentViewType } from '../types/commentsTypes';
import { commentsQueryRepository } from '../repositories/commentsQueryRepository';
import { STATUSES } from '../../../common/variables/variables';

export const getCommentById = async (
  req: Request<CommentsRequestWithParamsType>,
  res: Response,
) => {
  const commentId: string = req.params.id;
  const comment: CommentViewType | null =
    await commentsQueryRepository.getCommentById(commentId);
  if (!comment) {
    res.status(STATUSES.NOT_FOUNT_404).send('Commentary not found. Incorrect ID.');
    return;
  }
  res.status(200).send(comment);
};
