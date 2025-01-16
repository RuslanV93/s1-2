import { Request, Response } from 'express';
import { CommentsRequestWithParamsType } from '../types/commentsResponseRequestTypes';
import { CommentViewType } from '../types/commentsTypes';
import { STATUSES } from '../../../common/variables/variables';
import { DomainStatusCode } from '../../../common/types/types';
import { resultCodeToHttpFunction } from '../../../common/helpers/resultCodeToHttpFunction';
import { CommentsQueryRepository } from '../repositories/commentsQueryRepository';
import { CommentsService } from '../services/commentsService';

export class CommentsController {
  constructor(
    private commentsQueryRepository: CommentsQueryRepository,
    private commentsService: CommentsService,
  ) {}
  async getCommentById(req: Request<CommentsRequestWithParamsType>, res: Response) {
    const commentId: string = req.params.id;
    const comment: CommentViewType | null =
      await this.commentsQueryRepository.getCommentById(commentId);
    if (!comment) {
      res.status(STATUSES.NOT_FOUNT_404).send('Commentary not found. Incorrect ID.');
      return;
    }
    res.status(STATUSES.OK_200).send(comment);
  }
  async updateComment(req: Request, res: Response) {
    const userId: string = req.user.id;
    const commentId: string = req.params.id;
    const commentNewText: string = req.body.content;

    const updateCommentResult = await this.commentsService.updateComment(
      userId,
      commentId,
      commentNewText,
    );
    if (updateCommentResult.status !== DomainStatusCode.Success) {
      res
        .status(resultCodeToHttpFunction(updateCommentResult.status))
        .send({ errorsMessages: updateCommentResult.extensions });
      return;
    }
    res.sendStatus(STATUSES.NO_CONTENT_204);
    return;
  }
  async deleteComment(req: Request<CommentsRequestWithParamsType>, res: Response) {
    const commentId: string = req.params.id;
    const userId: string = req.user.id;
    const deleteCommentResult = await this.commentsService.deleteComment(
      commentId,
      userId,
    );
    if (deleteCommentResult.status !== DomainStatusCode.Success) {
      res
        .status(resultCodeToHttpFunction(deleteCommentResult.status))
        .send(deleteCommentResult.extensions);
      return;
    }
    res.sendStatus(STATUSES.NO_CONTENT_204);
  }
}
