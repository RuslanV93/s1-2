import { ObjectId } from 'mongodb';
import { PostLikeDbType } from '../../likes/types/likesTypes';
import { HydratedDocument, Model } from 'mongoose';
import { MyLikesStatus } from '../../comments/types/commentsTypes';

export type PostMethodsType = {
  updateLikesCount: (likeAndDislikeCounter: {
    like: number;
    dislike: number;
  }) => any;
};
export type NewestLikesType = {
  addedAt: string;
  userId: string;
  login: string;
};
export type PostsModelType = Model<PostDbType, {}, PostMethodsType> & {
  makeInstance(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
  ): HydratedDocument<PostDbType, PostMethodsType>;
};
export type ExtendedLikesInfoType = {
  likesCount: number;
  dislikesCount: number;
  myStatus?: MyLikesStatus;
  newestLikes?: NewestLikesType[];
};
export type PostDbType = {
  _id: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: ObjectId;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtendedLikesInfoType;
};

export type NewPostType = Omit<PostDbType, '_id'>;

export type PostForUpdateType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: ObjectId;
  blogName: string | null;
};
export type PostViewType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string | null;
  createdAt?: string;
  extendedLikesInfo: ExtendedLikesInfoType;
};
export type AllPostsViewType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<PostViewType>;
};
