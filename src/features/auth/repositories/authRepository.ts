import { UserDbType } from '../../users/types/usersTypes';
import { WithId } from 'mongodb';
import { usersCollection } from '../../../db/db';
import { Users } from '../../users/domain/users.entity';
import { HydratedDocument } from 'mongoose';

/** Create search filter function */
const createFilter = (enteredField: string) => {
  const filter: any = {};
  if (enteredField.includes('@')) {
    filter.email = enteredField;
  } else {
    filter.login = enteredField;
  }
  return filter;
};
export const authRepository = {
  /** Getting user info for hash and password compare */
  async getUserByLogin(loginField: string): Promise<UserDbType | null> {
    const filter = createFilter(loginField);
    const [user]: Array<UserDbType> = await usersCollection
      .find<UserDbType>(filter)
      .toArray();

    if (!user) {
      return null;
    }
    return user;
  },
  async findUserByConfirmCode(confirmCode: string) {
    const user = await usersCollection.findOne({
      'emailConfirmation.confirmationCode': confirmCode,
    });

    if (!user) {
      return null;
    }
    return user;
  },

  /** Registration confirm. Finding EmailConfirmation fields and update confirmation. */
  async registrationConfirm(
    confirmCode: string,
  ): Promise<WithId<UserDbType> | null> {
    const confirmResult = await usersCollection.findOneAndUpdate(
      {
        'emailConfirmation.confirmationCode': confirmCode,
      },
      {
        $set: { 'emailConfirmation.isConfirmed': 'confirmed' },
      },
      { returnDocument: 'after' },
    );

    if (!confirmResult) {
      return null;
    }

    return confirmResult as UserDbType;
  },

  /** Find user by users email */
  async findUser(email: string) {
    const user: UserDbType | null = await Users.findOne<UserDbType>({
      email: email,
    });
    if (!user) {
      return null;
    }
    return user;
  },

  /** Updating email confirm fields. Update confirm code and expiration date */
  async emailConfirmationResendUpdate(
    email: string,
    newExpirationDate: Date,
    newConfirmationCode: string,
  ): Promise<UserDbType | null> {
    const updatedUser = await usersCollection.findOneAndUpdate(
      { email: email },
      {
        $set: {
          'emailConfirmation.expirationDate': newExpirationDate,
          'emailConfirmation.confirmationCode': newConfirmationCode,
        },
      },
      { returnDocument: 'after' },
    );
    if (!updatedUser) {
      return null;
    }
    return updatedUser as UserDbType;
  },
  async setPasswordRecoveryInfo(
    email: string,
    recoveryCode: string,
    recoveryCodeExpDate: Date,
  ) {
    try {
      const user = await Users.findOne({ email });
      console.log(user);
      if (!user) {
        return null;
      }
      user.passwordInfo.passwordRecoveryCode = recoveryCode;
      user.passwordInfo.passwordRecoveryCodeExpires = recoveryCodeExpDate;
      return await user.save();
    } catch (error) {
      console.log(error);
      return null;
    }
  },
  async findUserByPasswordConfirmCode(passwordRecoveryCode: string) {
    const user: UserDbType | null = await Users.findOne({
      'passwordInfo.passwordRecoveryCode': passwordRecoveryCode,
    });
    if (!user) {
      return null;
    }
    return user;
  },
  async saveNewPassword(email: string, newPassword: string) {
    const user: HydratedDocument<UserDbType> | null = await Users.findOne({
      email,
    });
    if (!user) {
      return null;
    }
    user.passwordInfo.passwordRecoveryCode = null;
    user.passwordInfo.passwordRecoveryCodeExpires = null;
    user.passwordInfo.passwordHash = newPassword;
    return await user.save();
  },
};
