import { ObjectId } from 'mongodb';

export type PostDbType = {
  _id: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: ObjectId;
  blogName: string;
  createdAt: string;
};

export type NewPostType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: ObjectId;
  blogName: string | null;
  createdAt: string;
};
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
};
export type AllPostsViewType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<PostViewType>;
};
