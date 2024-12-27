import { UserDbType } from '../../users/types/usersTypes';
import { ObjectId, WithId } from 'mongodb';
import { usersCollection } from '../../../db/db';
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
  /** Getting password hash from database. */
  async getHash(loginField: string): Promise<UserDbType | null> {
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
    const user: UserDbType | null = await usersCollection.findOne<UserDbType>({
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

  /** Update refresh token in database */
  async updateRefreshToken(userId: string, tokenVersion: string | null) {
    const result = await usersCollection.findOneAndUpdate(
      {
        _id: new ObjectId(userId),
      },
      { $set: { 'refreshTokenInfo.tokenVersion': tokenVersion } },
      { returnDocument: 'after' },
    );
    if (!result) {
      return null;
    }
    return result;
  },

  async getUsersRefreshTokenVersion(userId: string) {
    const user: UserDbType | null = await usersCollection.findOne<UserDbType>({
      _id: new ObjectId(userId),
    });
    if (!user) {
      return undefined;
    } else if (!user.refreshTokenInfo.tokenVersion) {
      return null;
    }
    return user.refreshTokenInfo.tokenVersion;
  },
};
