import { LikesDbType, NewLikesType } from '../types/likesTypes';
import { Likes } from '../domain/likes.entity';
import { MyLikesStatus } from '../../comments/types/commentsTypes';
import { ObjectId } from 'mongodb';

export class LikesRepository {
  /** set new like status*/
  async newLikeStatus(
    parentId: string,
    userId: string,
    likeStatus: MyLikesStatus,
  ): Promise<LikesDbType> {
    try {
      const result = await Likes.findOneAndUpdate(
        {
          parentId: new ObjectId(parentId),
          commentId: new ObjectId(userId),
        },
        { $set: { likeStatus: likeStatus } },
        { upsert: true, new: true, runValidators: true },
      );
      return result;
    } catch (error) {
      console.error(error);
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  }
}
