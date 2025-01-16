import mongoose from 'mongoose';
import {
  EmailConfirmationType,
  PasswordInfoType,
  UserDbType,
} from '../types/usersTypes';
import { BLOGGERS_PLATFORM } from '../../../common/variables/variables';

const emailConfirmationSchema = new mongoose.Schema<EmailConfirmationType>(
  {
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: false, default: null },
    isConfirmed: { type: String, required: true },
    emailConfirmationCooldown: { type: Date, required: false, default: null },
  },
  { versionKey: false, _id: false },
);

const passwordInfoSchema = new mongoose.Schema<PasswordInfoType>(
  {
    passwordHash: { type: String, required: true },
    passwordRecoveryCode: { type: String, required: false, default: null },
    passwordRecoveryCodeExpires: { type: Date, required: false, default: null },
  },
  { versionKey: false, _id: false },
);

const usersSchema = new mongoose.Schema<UserDbType>(
  {
    login: { type: String, required: true },
    email: { type: String, required: true },
    passwordInfo: { type: passwordInfoSchema, required: true },
    createdAt: { type: String, required: true },
    emailConfirmation: { type: emailConfirmationSchema, required: true },
  },
  {
    collection: BLOGGERS_PLATFORM.users,
    versionKey: false,
  },
);

export const Users = mongoose.model<UserDbType>('Users', usersSchema);
