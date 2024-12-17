import { usersCollection } from '../../../db/db';
import { UserDbType } from '../../users/types/usersTypes';
import { WithId } from 'mongodb';

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
  async registrationConfirm(confirmCode: string): Promise<WithId<UserDbType> | null> {
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

  async findUser (email:string) {
    const user = await usersCollection.findOne({})
  }
};
