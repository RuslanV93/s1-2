import { Likes } from '../domain/likes.entity';
import { ObjectId } from 'mongodb';
import { LikesDbType, LikesRepoResultType } from '../types/likesTypes';
import { MyLikesStatus } from '../../comments/types/commentsTypes';

export class LikesQueryRepository {
  /** Getting like status by comment ID and user ID*/
  async getLikeStatusFromDb(
    commentId: string,
    userId: string,
  ): Promise<LikesRepoResultType> {
    try {
      if (userId === 'none') {
        return {
          success: true,
          status: MyLikesStatus.none,
        };
      }
      const result: LikesDbType | null = await Likes.findOne({
        parentId: new ObjectId(commentId),
        userId: new ObjectId(userId),
      });
      if (!result) {
        return {
          success: true,
          status: MyLikesStatus.none,
        };
      }
      return {
        success: true,
        status: result.status ? result.status : MyLikesStatus.none,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  async getLikesStatuses(userId: string, commentIds: ObjectId[]) {
    const likes: LikesDbType[] = await Likes.find({
      parentId: { $in: commentIds },
      userId: new ObjectId(userId),
    }).lean();

    if (likes.length === 0) {
      return null;
    }
    return likes;
  }
}
