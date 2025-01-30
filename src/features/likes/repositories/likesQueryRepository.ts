import { CommentLikesModel, PostLikesModel } from '../domain/likes.entity';
import { ObjectId } from 'mongodb';
import {
  CommentLikesDbType,
  LikesRepoResultType,
  PostLikeDbType,
} from '../types/likesTypes';
import { MyLikesStatus } from '../../comments/types/commentsTypes';
import { injectable } from 'inversify';

@injectable()
export class LikesQueryRepository {
  /** Getting like status by comment ID and user ID*/
  async getCommentLikeStatusFromDb(
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
      const result: CommentLikesDbType | null = await CommentLikesModel.findOne({
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
  async getCommentLikesStatuses(userId: string, commentIds: ObjectId[]) {
    if (userId === 'none') {
      return null;
    }
    const likes: CommentLikesDbType[] = await CommentLikesModel.find({
      parentId: { $in: commentIds },
      userId: new ObjectId(userId),
    }).lean();

    if (likes.length === 0) {
      return null;
    }
    return likes;
  }
  async getPostNewestLike(postIds: ObjectId[]) {
    const allLikes = await PostLikesModel.aggregate([
      {
        $match: {
          parentId: { $in: postIds },
          status: 'Like',
        },
      },
      {
        $sort: { addedAt: -1 },
      },
      {
        $group: {
          _id: '$parentId',
          likes: {
            $push: {
              addedAt: '$addedAt',
              userId: '$userId',
              login: '$login',
            },
          },
        },
      },
      {
        $project: {
          likes: { $slice: ['$likes', 0, 3] }, // Берем только первые 3 лайка для каждого поста
        },
      },
    ]);
    return new Map(allLikes.map((item) => [item._id.toString(), item.likes]));
  }
  async getPostLikesStatuses(userId: string, postIds: ObjectId[]) {
    if (userId === 'none') {
      return null;
    }
    const likes: PostLikeDbType[] = await PostLikesModel.find({
      parentId: { $in: postIds },
      userId: new ObjectId(userId),
    });

    if (likes.length === 0) {
      return null;
    }
    return likes;
  }
  async getPostLikesStatus(postId: string, userId: string) {
    try {
      if (userId === 'none') {
        return {
          success: true,
          status: MyLikesStatus.none,
        };
      }
      const result = await PostLikesModel.findOne({
        parentId: new ObjectId(postId),
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
}
