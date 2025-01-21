import { LikesRepository } from '../repositories/likesRepository';
import { MyLikesStatus } from '../../comments/types/commentsTypes';
import { resultObject } from '../../../common/helpers/resultObjectHelpers';
import { LikeStatusChange } from '../utils/handleLikeStatusChange';
import { CommentsRepository } from '../../comments/repositories/commentsRepository';
import { resultCodeToHttpFunction } from '../../../common/helpers/resultCodeToHttpFunction';
import { DomainStatusCode } from '../../../common/types/types';

export class LikesService {
  constructor(
    private likesRepository: LikesRepository,
    private likeStatusChange: LikeStatusChange,
    private commentsRepository: CommentsRepository,
  ) {}
  async updateLikeStatus(
    commentId: string,
    userId: string,
    oldLikeStatus: MyLikesStatus,
    newLikeStatus: MyLikesStatus,
  ) {
    try {
      const comment = await this.commentsRepository.findComment(commentId);
      if (!comment) {
        return resultObject.notFoundResultObject({
          message: 'Comment not found!',
          field: 'commentId',
        });
      }
      if (newLikeStatus === oldLikeStatus) {
        return resultObject.successResultObject({
          message: 'Status has already been set!',
          field: 'likeStatus',
        });
      }
      /** getting counter object */
      const likeAndDislikeCounters =
        this.likeStatusChange.calculateLikeCounterChange(
          oldLikeStatus,
          newLikeStatus,
        );

      /** Updating like Status*/
      const likeStatusUpdateResult = await this.likesRepository.setNewLikeStatus(
        commentId,
        userId,
        newLikeStatus,
      );
      if (likeStatusUpdateResult) {
      }

      await this.commentsRepository.changeLikesCount(
        commentId,
        likeAndDislikeCounters,
      );
      return resultObject.successResultObject();
    } catch (e) {
      return resultObject.internalErrorResultObject();
    }
  }
}
