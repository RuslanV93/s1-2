import { ObjectId } from 'mongodb';
import { HydratedDocument, Model } from 'mongoose';

export type BlogsModelType = Model<BlogDbType> & {
  makeInstance(
    name: string,
    description: string,
    websiteUrl: string,
  ): HydratedDocument<BlogDbType>;
};

export type BlogDbType = {
  _id: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};
export type NewBlogType = Omit<BlogDbType, '_id'>;

export type BlogForUpdateType = {
  name: string;
  description: string;
  websiteUrl: string;
};
export type BlogViewType = {
  id?: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};
export type AllBlogsViewType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<BlogViewType>;
};
