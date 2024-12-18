import { ObjectId } from "mongodb";

export type EmailConfirmationType = {
  confirmationCode: string;
  expirationDate: Date | null;
  isConfirmed: string;
  emailConfirmationCooldown: Date | null;
};

export type UserDbType = {
  _id: ObjectId;
  login: string;
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
  emailConfirmation: EmailConfirmationType;
};
export type NewUserType = {
  login: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  emailConfirmation: EmailConfirmationType;
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
