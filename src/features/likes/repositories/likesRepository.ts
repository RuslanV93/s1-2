import { CommentLikesDbType, PostLikeDbType } from '../types/likesTypes';
import { CommentLikesModel, PostLikesModel } from '../domain/likes.entity';
import { MyLikesStatus } from '../../comments/types/commentsTypes';
import { ObjectId } from 'mongodb';
import { injectable } from 'inversify';
import { HydratedDocument } from 'mongoose';

@injectable()
export class LikesRepository {
  /** set new like status. if like doesn't exist create new object*/
  async setNewCommentLikeStatus(
    parentId: string,
    userId: string,
    likeStatus: MyLikesStatus,
  ): Promise<CommentLikesDbType> {
    try {
      const result = await CommentLikesModel.findOneAndUpdate(
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
  async deleteCommentLikeEntity(commentId: string) {
    try {
      const deleteResult = await CommentLikesModel.deleteMany({
        parentId: new ObjectId(commentId),
      });
      return deleteResult.deletedCount;
    } catch (error) {
      throw Error(error instanceof Error ? error.message : 'Unknown error');
    }
  }
  async findPostLike(postId: string, userId: string) {
    try {
      const result = await PostLikesModel.findOne({
        parentId: new ObjectId(postId),
        userId: new ObjectId(userId),
      });
      return result === null ? null : result;
    } catch (error) {
      console.error(error);
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  }
  async saveLike(like: HydratedDocument<CommentLikesDbType | PostLikeDbType>) {
    try {
      await like.save();
      return like;
    } catch (error) {
      console.error(error);
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  }
  async deletePostLikeEntity(postId: ObjectId): Promise<number> {
    try {
      const deleteResult = await PostLikesModel.deleteMany({
        parentId: postId,
      });
      return deleteResult.deletedCount;
    } catch (error) {
      console.error(error);
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  }
}
