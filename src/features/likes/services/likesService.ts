import { LikesRepository } from '../repositories/likesRepository';
import { MyLikesStatus } from '../../comments/types/commentsTypes';
import { resultObject } from '../../../common/helpers/resultObjectHelpers';
import { LikeStatusChange, likeStatusChange } from '../utils/handleLikeStatusChange';

export class LikesService {
  constructor(
    private likesRepository: LikesRepository,
    private likeStatusChange: LikeStatusChange,
  ) {}
  async updateLikeStatus(
    commentId: string,
    userId: string,
    oldLikeStatus: MyLikesStatus,
    newLikeStatus: MyLikesStatus,
  ) {
    if (newLikeStatus === oldLikeStatus) {
      return resultObject.badRequestResultObject({
        message: 'Status has already been set!',
        field: 'likeStatus',
      });
    }
    const likeStatusChangeResult = this.likeStatusChange.handleLikeStatus(
      commentId,
      userId,
      oldLikeStatus,
      newLikeStatus,
    );
    return;
  }
}
