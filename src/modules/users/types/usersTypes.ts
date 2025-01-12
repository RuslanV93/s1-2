import { ObjectId } from 'mongodb';

export type EmailConfirmationType = {
  confirmationCode: string;
  expirationDate: Date | null;
  isConfirmed: string;
  emailConfirmationCooldown: Date | null;
};
export type PasswordInfoType = {
  passwordHash: string;
  passwordRecoveryCode: string | null;
  passwordRecoveryCodeExpires: Date | null;
};
export type RefreshTokenInfoType = {
  tokenVersion: string | null;
};
export type UserDbType = {
  _id: ObjectId;
  login: string;
  email: string;
  passwordInfo: PasswordInfoType,
  createdAt: string;
  emailConfirmation: EmailConfirmationType;
};
export type NewUserType = {
  login: string;
  email: string;
  passwordInfo: PasswordInfoType,
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
