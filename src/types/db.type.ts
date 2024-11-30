// export type DBType = {
//   posts: Array<RequestPostType>;
//   blogs: Array<RequestBlogType>;
// };

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
export type BlogDbType = {
  _id: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};
export type NewBlogType = {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};
export type NewPostType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: ObjectId;
  blogName: string | null;
  createdAt: string;
};

export type BlogForUpdateType = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
};
export type PostForUpdateType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: ObjectId;
  blogName: string | null;
};
export type BlogViewType = {
  id?: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
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

export type AllBlogsViewType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<BlogViewType>;
};
