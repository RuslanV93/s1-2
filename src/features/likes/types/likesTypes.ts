import { ObjectId } from 'mongodb';
import { MyLikesStatus } from '../../comments/types/commentsTypes';
import { HydratedDocument, Model } from 'mongoose';

/** Comments Likes Types */
export type CommentLikesDbType = {
  _id: ObjectId;
  status: MyLikesStatus;
  userId: ObjectId;
  parentId: ObjectId;
};

export type NewCommentLikesType = {
  status: MyLikesStatus;
  userId: ObjectId;
  parentId: ObjectId;
};
export type LikesRepoResultType = {
  success: boolean;
  status?: MyLikesStatus | null;
  error?: string;
};

/** Posts Likes Types */

export type PostLikeDbType = {
  _id: ObjectId;
  status: MyLikesStatus;
  userId: ObjectId;
  parentId: ObjectId;
  login: string;
  addedAt: Date;
};
