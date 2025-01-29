import mongoose, { HydratedDocument } from 'mongoose';
import { ObjectId } from 'mongodb';
import { BLOGGERS_PLATFORM } from '../../../common/variables/variables';
import {
  ExtendedLikesInfoType,
  PostDbType,
  PostsModelType,
} from '../types/postsTypes';

const ExtendedLikesInfoSchema = new mongoose.Schema<ExtendedLikesInfoType>(
  {
    likesCount: { type: Number, default: 0 },
    dislikesCount: { type: Number, default: 0 },
  },
  { versionKey: false, _id: false },
);
const PostsSchema = new mongoose.Schema<PostDbType>(
  {
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: mongoose.Schema.Types.ObjectId, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, required: true },
    extendedLikesInfo: { type: ExtendedLikesInfoSchema },
  },
  {
    collection: BLOGGERS_PLATFORM.posts,
    optimisticConcurrency: true,
  },
);
PostsSchema.method(
  'updateLikesCount',
  function updateLikesCount(likeAndDislikeCounter: {
    like: number;
    dislike: number;
  }) {
    this.extendedLikesInfo.likesCount += likeAndDislikeCounter.like;
    this.extendedLikesInfo.dislikesCount += likeAndDislikeCounter.dislike;
  },
);

PostsSchema.static(
  'makeInstance',
  function makeInstance(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
  ): HydratedDocument<PostDbType> {
    return new PostModel({
      title,
      shortDescription,
      content,
      blogId: new ObjectId(blogId),
      blogName,
      createdAt: new Date().toISOString(),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
      },
    });
  },
);

export const PostModel = mongoose.model<PostDbType, PostsModelType>(
  'posts',
  PostsSchema,
);
