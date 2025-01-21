import { Request, Response } from 'express';
import { CommentsRequestWithParamsType } from '../types/commentsResponseRequestTypes';
import { CommentViewType, MyLikesStatus } from '../types/commentsTypes';
import { STATUSES } from '../../../common/variables/variables';
import { DomainStatusCode } from '../../../common/types/types';
import { resultCodeToHttpFunction } from '../../../common/helpers/resultCodeToHttpFunction';
import { CommentsQueryRepository } from '../repositories/commentsQueryRepository';
import { CommentsService } from '../services/commentsService';
import { LikesQueryRepository } from '../../likes/repositories/likesQueryRepository';
import { LikesRepoResultType } from '../../likes/types/likesTypes';
import {
  LikeResponseWithBodyType,
  LikeResponseWithParamsType,
} from '../../likes/types/likesRequestResponseTypes';
import { LikesService } from '../../likes/services/likesService';
import { CommentsRepository } from '../repositories/commentsRepository';

export class CommentsController {
  constructor(
    private commentsRepository: CommentsRepository,
    private commentsQueryRepository: CommentsQueryRepository,
    private commentsService: CommentsService,
    private likesQueryRepository: LikesQueryRepository,
    private likesService: LikesService,
  ) {}

  /** Getting comments by comment ID */
  async getCommentById(req: Request<CommentsRequestWithParamsType>, res: Response) {
    const userId = req.user.id;
    const commentId: string = req.params.id;
    // getting comment entity from db. likes info already included.
    const comment: CommentViewType | null =
      await this.commentsQueryRepository.getCommentById(commentId, userId);
    if (!comment) {
      res.status(STATUSES.NOT_FOUND_404).send('Commentary not found. Incorrect ID.');
      return;
    }

    res.status(STATUSES.OK_200).send(comment);
  }

  /** Update existing comment */
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

  /** Delete existing comment*/
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

  /** Update Like status (none, like, dislike) */
  async updateLikeStatus(
    req: Request<LikeResponseWithParamsType, {}, LikeResponseWithBodyType>,
    res: Response,
  ) {
    try {
      const newLikeStatus = req.body.likeStatus as MyLikesStatus;
      const commentId: string = req.params.id;
      const userId: string = req.user.id;

      const existingLikeStatus: LikesRepoResultType =
        await this.likesQueryRepository.getLikeStatusFromDb(commentId, userId);
      if (!existingLikeStatus.status) {
        res.status(STATUSES.INTERNAL_ERROR_500).send('Something went wrong.');
        return;
      }
      const updateResult = await this.likesService.updateLikeStatus(
        commentId,
        userId,
        existingLikeStatus.status,
        newLikeStatus,
      );
      if (updateResult.status !== DomainStatusCode.Success) {
        res
          .status(resultCodeToHttpFunction(updateResult.status))
          .send(updateResult.extensions);
        return;
      }
      res.sendStatus(STATUSES.NO_CONTENT_204);
    } catch (error) {
      res.status(STATUSES.INTERNAL_ERROR_500).send(error);
      return;
    }
  }
}
