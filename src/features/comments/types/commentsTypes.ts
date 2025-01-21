import { ObjectId } from 'mongodb';

export enum MyLikesStatus {
  none = 'None',
  like = 'Like',
  dislike = 'Dislike',
}
export type CommentatorInfoType = {
  userId: ObjectId | string;
  userLogin: string;
};

export type LikesInfoType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: MyLikesStatus;
};

export type NewCommentType = {
  postId: ObjectId;
  content: string;
  commentatorInfo: CommentatorInfoType;
  createdAt: string;
  likesInfo: Omit<LikesInfoType, 'myStatus'>;
};

export type UpdateCommentType = {
  content: string;
};
export type CommentDbType = {
  _id: ObjectId;
  postId: ObjectId;
  content: string;
  commentatorInfo: CommentatorInfoType;
  createdAt: string;
  likesInfo: Omit<LikesInfoType, 'myStatus'>;
};

export type CommentViewType = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfoType;
  createdAt: string;
  likesInfo: LikesInfoType;
};

export type AllCommentsViewType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<CommentViewType>;
};
