import { ObjectId } from 'mongodb';

export type commentatorInfoType = {
  userId: ObjectId | string;
  userLogin: string;
};

export type NewCommentType = {
  postId: ObjectId;
  content: string;
  commentatorInfo: commentatorInfoType;
  createdAt: string;
};

export type UpdateCommentType = {
  content: string;
};
export type CommentDbType = {
  _id: ObjectId;
  content: string;
  commentatorInfo: commentatorInfoType;
  createdAt: string;
};

export type CommentViewType = {
  id: string;
  content: string;
  commentatorInfo: commentatorInfoType;
  createdAt: string;
};

export type AllCommentsViewType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<CommentViewType>;
};
