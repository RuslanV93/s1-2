import mongoose, { HydratedDocument, Model } from 'mongoose';
import { CommentLikesDbType, PostLikeDbType } from '../types/likesTypes';
import { BLOGGERS_PLATFORM } from '../../../common/variables/variables';
import { MyLikesStatus } from '../../comments/types/commentsTypes';
import { ObjectId } from 'mongodb';
import { PostDbType } from '../../posts/types/postsTypes';

const CommentLikesSchema = new mongoose.Schema<CommentLikesDbType>(
  {
    status: { type: String, enum: ['None', 'Like', 'Dislike'], required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { collection: BLOGGERS_PLATFORM.commentLikes, versionKey: false },
);

export const CommentLikesModel = mongoose.model<CommentLikesDbType>(
  'commentLikes',
  CommentLikesSchema,
);

/** Post Likes Schema and Model */
export type PostLikeMethodsType = {
  updateLikeFields: (newStatus: MyLikesStatus) => any;
};
export type PostLikeModelType = Model<PostLikeDbType, {}, PostLikeMethodsType> & {
  makeInstance: (
    status: MyLikesStatus,
    userId: string,
    parentId: string,
    login: string,
  ) => HydratedDocument<PostLikeDbType, PostLikeMethodsType>;
};

const PostLikesSchema = new mongoose.Schema<
  PostLikeDbType,
  PostLikeModelType,
  PostLikeMethodsType
>(
  {
    status: { type: String, enum: ['None', 'Like', 'Dislike'], required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, required: true },
    login: { type: String, required: true },
    addedAt: { type: Date, required: true },
  },
  {
    collection: BLOGGERS_PLATFORM.postLikes,
    optimisticConcurrency: true,
  },
);

PostLikesSchema.static(
  'makeInstance',
  function makeInstance(
    status: MyLikesStatus,
    userId: string,
    parentId: string,
    login: string,
  ) {
    return new this({
      status,
      userId: new ObjectId(userId),
      parentId: new ObjectId(parentId),
      login: login,
      addedAt: new Date(),
    });
  },
);

PostLikesSchema.method(
  'updateLikeFields',
  function updateLikeFields(newStatus: MyLikesStatus) {
    this.status = newStatus;
  },
);

export const PostLikesModel = mongoose.model<PostLikeDbType, PostLikeModelType>(
  'postLikes',
  PostLikesSchema,
);
