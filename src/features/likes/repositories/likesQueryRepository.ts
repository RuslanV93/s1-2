import { Likes } from '../domain/likes.entity';
import { ObjectId } from 'mongodb';
import { LikesDbType, LikesRepoResultType, NewLikesType } from '../types/likesTypes';
import { MyLikesStatus } from '../../comments/types/commentsTypes';

export class LikesQueryRepository {
  /** Getting like status by comment ID and user ID*/
  async getLikeStatus(
    commentId: string,
    userId: string,
  ): Promise<LikesRepoResultType> {
    try {
      const result = await Likes.findOne({
        parentId: new ObjectId(commentId),
        userId: new ObjectId(userId),
      });
      return {
        success: true,
        status: result ? result.status : null,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
