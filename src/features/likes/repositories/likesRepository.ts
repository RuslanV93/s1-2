import { LikesDbType, NewLikesType } from '../types/likesTypes';
import { Likes } from '../domain/likes.entity';
import { MyLikesStatus } from '../../comments/types/commentsTypes';
import { ObjectId } from 'mongodb';

export class LikesRepository {
  /** set new like status. if like doesn't exist create new object*/
  async setNewLikeStatus(
    parentId: string,
    userId: string,
    likeStatus: MyLikesStatus,
  ): Promise<LikesDbType> {
    try {
      const result = await Likes.findOneAndUpdate(
        {
          parentId: new ObjectId(parentId),
          userId: new ObjectId(userId),
        },
        { $set: { status: likeStatus } },
        { upsert: true, new: true, runValidators: true },
      );
      return result;
    } catch (error) {
      console.error(error);
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  }
  async deleteLikeEntity(commentId: string) {
    try {
      const deleteResult = await Likes.deleteMany({
        parentId: new ObjectId(commentId),
      });
      return deleteResult.deletedCount;
    } catch (error) {
      throw Error(error instanceof Error ? error.message : 'Unknown error');
    }
  }
}
