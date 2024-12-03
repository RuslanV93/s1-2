import { ObjectId } from 'mongodb';

export type UserDbType = {
  _id: ObjectId;
  login: string;
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
};
export type NewUserType = {
  login: string;
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
};
export type UserViewType = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};
export type AllUsersViewType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<UserViewType>;
};
